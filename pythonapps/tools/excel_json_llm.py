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
    """
    def __init__(self, 
                 input_file, 
                 sheet_name=None, 
                 output_dir="output", 
                 key_column=None, 
                 skip_columns=0,
                 row_key_name="RowIdentifier", 
                 column_suffix=""):
        """
        Initialize the converter with configuration parameters.
        
        Args:
            input_file: Path to the Excel file
            sheet_name: Name of the sheet to process (uses first sheet if None)
            output_dir: Directory to save output JSON files
            key_column: Column containing keys for grouping data
            skip_columns: Number of columns to skip from the start
            row_key_name: Name to use as key for row identifiers in JSON
            column_suffix: Optional suffix to append to column names
        """
        self.input_file = Path(input_file)
        self.sheet_name = sheet_name
        self.output_dir = Path(output_dir)
        self.key_column = key_column
        self.skip_columns = skip_columns
        self.row_key_name = row_key_name
        self.column_suffix = column_suffix
        self.data = None

        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)

        if not self.input_file.exists():
            raise FileNotFoundError(f"Input file not found: {self.input_file}")

    def load_data(self):
        """Load data from Excel file"""
        try:
            if self.sheet_name:
                self.data = pd.read_excel(
                    self.input_file,
                    sheet_name=self.sheet_name,
                    header=0,
                    keep_default_na=False,
                    dtype=str
                )
            else:
                # Try to read the first sheet if no sheet name provided
                self.data = pd.read_excel(
                    self.input_file,
                    header=0,
                    keep_default_na=False,
                    dtype=str
                )
                logger.info(f"Auto-selected first sheet")
        except Exception as e:
            logger.error(f"Error reading Excel file: {e}")
            raise

        # If key_column not provided, try to determine a suitable column
        if self.key_column is None:
            if len(self.data.columns) <= self.skip_columns:
                raise ValueError(f"Excel file has fewer than {self.skip_columns + 1} columns")
            self.key_column = self.data.columns[self.skip_columns]
            logger.info(f"Auto-selected key column: {self.key_column}")

        if self.key_column not in self.data.columns:
            raise ValueError(f"Key column '{self.key_column}' not found in columns: {list(self.data.columns)}")

        logger.info(f"Loaded Excel file '{self.input_file}' successfully")

    def process(self):
        """Process the Excel data and convert to JSON"""
        try:
            self.load_data()
            
            # Extract unique key values from the key column
            unique_keys = set()
            for _, row in self.data.iterrows():
                key_value = str(row[self.key_column]).strip()
                if key_value and key_value != self.key_column:
                    unique_keys.add(key_value)
            
            logger.info(f"Found {len(unique_keys)} unique keys")
            
            # Process each key separately
            for key_value in unique_keys:
                # Create result for this key
                key_result = []
                
                # Format the column name for the output
                column_key = f"{key_value}{' ' + self.column_suffix if self.column_suffix else ''}".upper()
                
                # Dictionary to track row identifiers
                row_values = {}
                
                # Extract data for this key
                for _, row in self.data.iterrows():
                    current_key = str(row[self.key_column]).strip()
                    if current_key != key_value:
                        continue
                        
                    for col_idx, col in enumerate(self.data.columns):
                        # Skip columns based on configuration
                        if col_idx < self.skip_columns or col == self.key_column:
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
                    safe_key_name = key_value.lower().replace(' ', '_').replace('/', '_').replace('\\', '_')
                    output_file = self.output_dir / f"{safe_key_name}.json"
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(key_result, f, indent=2, ensure_ascii=False)
                    logger.info(f"Saved key '{key_value}' to: {output_file}")
            
            return True
        except Exception as e:
            logger.error(f"Error processing data: {e}")
            return False
    
def main():
    parser = argparse.ArgumentParser(description="Convert Excel data to JSON files with flexible configuration")
    parser.add_argument('-i', '--input', required=True, help="Excel file path")
    parser.add_argument('-s', '--sheet', help="Sheet name (if not provided, uses first sheet)")
    parser.add_argument('-k', '--key-column', help="Column name containing key values for grouping")
    parser.add_argument('-c', '--skip-columns', type=int, default=0, help="Number of columns to skip (default: 0)")
    parser.add_argument('-r', '--row-key-name', default='RowIdentifier', help="Key name for row identifiers (default: 'RowIdentifier')")
    parser.add_argument('-u', '--column-suffix', default='', help="Suffix to append to column names (optional)")
    parser.add_argument('-o', '--output-dir', default='output', help="Output directory for JSON files")

    args = parser.parse_args()

    try:
        converter = ExcelToJsonConverter(
            input_file=args.input,
            sheet_name=args.sheet,
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