import pandas as pd
import argparse
import logging
import json
import os
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ExcelToJsonConverter:
    """
    A generic class to convert Excel files to JSON list format with flexible configuration.
    This allows converting Excel data with varying structures into JSON output files.
    Automatically processes all sheets in the Excel file.
    """
    def __init__(self, 
                 input_file, 
                 output_dir="output", 
                 key_column=None, 
                 skip_columns=0,
                 row_key_name="RowIdentifier", 
                 column_suffix=""):
        """
        Initialize the converter with configuration parameters.
        
        Args:
            input_file: Path to the Excel file
            output_dir: Directory to save output JSON files
            key_column: Column containing keys for grouping data
            skip_columns: Number of columns to skip from the start
            row_key_name: Name to use as key for row identifiers in JSON
            column_suffix: Optional suffix to append to column names
        """
        self.input_file = Path(input_file)
        self.output_dir = Path(output_dir)
        self.key_column = key_column
        self.skip_columns = skip_columns
        self.row_key_name = row_key_name
        self.column_suffix = column_suffix
        self.all_sheets_data = {}
        self.sheet_names = []

        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)

        if not self.input_file.exists():
            raise FileNotFoundError(f"Input file not found: {self.input_file}")

    def get_all_sheet_names(self):
        """Get all available sheet names from the Excel file"""
        try:
            excel_file = pd.ExcelFile(self.input_file)
            self.sheet_names = excel_file.sheet_names
            
            if not self.sheet_names:
                raise ValueError("No sheets found in the Excel file")
            
            logger.info(f"Found {len(self.sheet_names)} sheets: {self.sheet_names}")
            return self.sheet_names
            
        except Exception as e:
            logger.error(f"Error detecting sheet names: {e}")
            raise

    def load_all_sheets(self):
        """Load data from all sheets in the Excel file"""
        try:
            # Get all sheet names
            self.get_all_sheet_names()
            
            # Load data from all sheets
            for sheet_name in self.sheet_names:
                try:
                    logger.info(f"Loading sheet: '{sheet_name}'")
                    
                    sheet_data = pd.read_excel(
                        self.input_file,
                        sheet_name=sheet_name,
                        header=0,
                        keep_default_na=False,
                        dtype=str
                    )
                    
                    # Skip empty sheets
                    if sheet_data.empty:
                        logger.warning(f"Sheet '{sheet_name}' is empty, skipping...")
                        continue
                    
                    self.all_sheets_data[sheet_name] = sheet_data
                    logger.info(f"Successfully loaded sheet '{sheet_name}' with {len(sheet_data)} rows and {len(sheet_data.columns)} columns")
                    
                except Exception as e:
                    logger.error(f"Error loading sheet '{sheet_name}': {e}")
                    continue
            
            if not self.all_sheets_data:
                raise ValueError("No valid sheets could be loaded from the Excel file")
                
        except Exception as e:
            logger.error(f"Error reading Excel file: {e}")
            raise

    def process_sheet(self, sheet_name, sheet_data):
        """Process a single sheet and convert to JSON"""
        try:
            logger.info(f"Processing sheet: '{sheet_name}'")
            
            # Determine key column for this sheet
            key_column = self.key_column
            if key_column is None:
                if len(sheet_data.columns) <= self.skip_columns:
                    logger.warning(f"Sheet '{sheet_name}' has fewer than {self.skip_columns + 1} columns, skipping...")
                    return False
                key_column = sheet_data.columns[self.skip_columns]
                logger.info(f"Auto-selected key column for sheet '{sheet_name}': '{key_column}'")

            if key_column not in sheet_data.columns:
                logger.error(f"Key column '{key_column}' not found in sheet '{sheet_name}' columns: {list(sheet_data.columns)}")
                return False

            # Extract unique key values from the key column
            unique_keys = set()
            for _, row in sheet_data.iterrows():
                key_value = str(row[key_column]).strip()
                if key_value and key_value != key_column:
                    unique_keys.add(key_value)
            
            logger.info(f"Sheet '{sheet_name}' - Found {len(unique_keys)} unique keys: {list(unique_keys)}")
            
            # Create sheet-specific output directory
            sheet_output_dir = self.output_dir / self.sanitize_filename(sheet_name)
            os.makedirs(sheet_output_dir, exist_ok=True)
            
            # Process each key separately
            for key_value in unique_keys:
                # Create result for this key
                key_result = []
                
                # Format the column name for the output
                column_key = f"{key_value}{' ' + self.column_suffix if self.column_suffix else ''}".upper()
                
                # Dictionary to track row identifiers
                row_values = {}
                
                # Extract data for this key
                for _, row in sheet_data.iterrows():
                    current_key = str(row[key_column]).strip()
                    if current_key != key_value:
                        continue
                        
                    for col_idx, col in enumerate(sheet_data.columns):
                        # Skip columns based on configuration
                        if col_idx < self.skip_columns or col == key_column:
                            continue
                        
                        row_id = str(col).strip()
                        cell_value = str(row[col]).strip()
                        if not cell_value or cell_value.lower() == 'nan':
                            continue
                        
                        # Split the value by newlines and create an array of trimmed lines
                        value_lines = [line.strip() for line in str(cell_value).split('\n') if line.strip()]
                        
                        # Add to row values dictionary
                        if row_id not in row_values:
                            row_values[row_id] = []
                        
                        # Add all values from this cell
                        row_values[row_id].extend(value_lines)
                
                # Generate output for this key
                for row_id, values in row_values.items():
                    key_result.append({
                        self.row_key_name: row_id,
                        column_key: values
                    })
                
                # Save to separate file
                if key_result:
                    safe_key_name = self.sanitize_filename(key_value)
                    output_file = sheet_output_dir / f"{safe_key_name}.json"
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(key_result, f, indent=2, ensure_ascii=False)
                    logger.info(f"Saved sheet '{sheet_name}' key '{key_value}' to: {output_file}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error processing sheet '{sheet_name}': {e}")
            return False

    def sanitize_filename(self, filename):
        """Sanitize filename to be filesystem-safe"""
        return filename.lower().replace(' ', '_').replace('/', '_').replace('\\', '_').replace(':', '_').replace('*', '_').replace('?', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_')

    def process(self):
        """Process all sheets in the Excel file and convert to JSON"""
        try:
            self.load_all_sheets()
            
            successful_sheets = 0
            failed_sheets = 0
            
            # Process each sheet
            for sheet_name, sheet_data in self.all_sheets_data.items():
                if self.process_sheet(sheet_name, sheet_data):
                    successful_sheets += 1
                else:
                    failed_sheets += 1
            
            logger.info(f"Processing completed: {successful_sheets} sheets successful, {failed_sheets} sheets failed")
            
            # Create summary file
            summary = {
                "input_file": str(self.input_file),
                "total_sheets": len(self.sheet_names),
                "processed_sheets": successful_sheets,
                "failed_sheets": failed_sheets,
                "sheet_names": self.sheet_names,
                "output_directory": str(self.output_dir)
            }
            
            summary_file = self.output_dir / "processing_summary.json"
            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2, ensure_ascii=False)
            logger.info(f"Processing summary saved to: {summary_file}")
            
            return successful_sheets > 0
            
        except Exception as e:
            logger.error(f"Error processing data: {e}")
            return False
    
def main():
    parser = argparse.ArgumentParser(description="Convert all sheets in Excel file to JSON files with automatic processing")
    parser.add_argument('-i', '--input', required=True, help="Excel file path")
    parser.add_argument('-k', '--key-column', help="Column name containing key values for grouping (auto-detected if not provided)")
    parser.add_argument('-c', '--skip-columns', type=int, default=0, help="Number of columns to skip from start (default: 0)")
    parser.add_argument('-r', '--row-key-name', default='RowIdentifier', help="Key name for row identifiers (default: 'RowIdentifier')")
    parser.add_argument('-u', '--column-suffix', default='', help="Suffix to append to column names (optional)")
    parser.add_argument('-o', '--output-dir', default='output', help="Output directory for JSON files (default: 'output')")

    args = parser.parse_args()

    try:
        converter = ExcelToJsonConverter(
            input_file=args.input,
            output_dir=args.output_dir,
            key_column=args.key_column,
            skip_columns=args.skip_columns,
            row_key_name=args.row_key_name,
            column_suffix=args.column_suffix
        )

        success = converter.process()
        if success:
            logger.info("Conversion completed successfully!")
        else:
            logger.error("Conversion failed!")
    except Exception as e:
        logger.error(f"Error: {e}")


if __name__ == "__main__":
    main()