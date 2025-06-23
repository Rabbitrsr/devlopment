import pandas as pd
import argparse
import logging
import json
import os
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class DataTableProcessor:
    """
    Converts Excel/CSV data to JSON with two grouping modes:
    1. Horizontal: Groups rows by a key column
    2. Vertical: Groups columns by a key row
    """
    
    def __init__(self, 
                 source_file, 
                 output_directory="processed_data", 
                 horizontal_key_column=None,
                 vertical_key_row=None,
                 skip_columns=None,
                 skip_rows=None,
                 horizontal_inner_prefix="",
                 vertical_inner_prefix="",
                 horizontal_outer_prefix="",
                 vertical_outer_prefix="",
                 horizontal_data_suffix="",
                 vertical_data_suffix=""):
        """Initialize processor with configuration"""
        self.source_file = Path(source_file)
        self.output_directory = Path(output_directory)
        
        # Grouping configuration
        self.horizontal_key_column = horizontal_key_column
        self.vertical_key_row = vertical_key_row
        
        # Skip configuration - convert to lists if needed
        if skip_columns is None:
            self.skip_columns = []
        elif isinstance(skip_columns, (int, str)):
            # Single value - convert to list, but maintain backwards compatibility
            # If it's an int, skip from 0 to that number (old behavior)
            if isinstance(skip_columns, int):
                self.skip_columns = list(range(skip_columns))
            else:
                # If string, parse as comma-separated list
                self.skip_columns = [int(x.strip()) for x in skip_columns.split(',') if x.strip().isdigit()]
        else:
            self.skip_columns = list(skip_columns)
            
        if skip_rows is None:
            self.skip_rows = []
        elif isinstance(skip_rows, (int, str)):
            # Single value - convert to list, but maintain backwards compatibility  
            # If it's an int, skip from 0 to that number (old behavior)
            if isinstance(skip_rows, int):
                self.skip_rows = list(range(skip_rows))
            else:
                # If string, parse as comma-separated list
                self.skip_rows = [int(x.strip()) for x in skip_rows.split(',') if x.strip().isdigit()]
        else:
            self.skip_rows = list(skip_rows)
        
        # Prefix/suffix configuration - ensure they're strings
        self.horizontal_inner_prefix = str(horizontal_inner_prefix) if horizontal_inner_prefix else ""
        self.vertical_inner_prefix = str(vertical_inner_prefix) if vertical_inner_prefix else ""
        self.horizontal_outer_prefix = str(horizontal_outer_prefix) if horizontal_outer_prefix else ""
        self.vertical_outer_prefix = str(vertical_outer_prefix) if vertical_outer_prefix else ""
        self.horizontal_data_suffix = str(horizontal_data_suffix) if horizontal_data_suffix else ""
        self.vertical_data_suffix = str(vertical_data_suffix) if vertical_data_suffix else ""
        
        # Debug: Print what we received
        logger.info(f"DataTableProcessor initialized with:")
        logger.info(f"  skip_columns: {self.skip_columns}")
        logger.info(f"  skip_rows: {self.skip_rows}")
        logger.info(f"  vertical_inner_prefix: '{self.vertical_inner_prefix}'")
        logger.info(f"  horizontal_inner_prefix: '{self.horizontal_inner_prefix}'")
        logger.info(f"  vertical_outer_prefix: '{self.vertical_outer_prefix}'")
        logger.info(f"  horizontal_outer_prefix: '{self.horizontal_outer_prefix}'")
        
        # Data containers
        self.data_sheets = {}
        self.sheet_identifiers = []

        # Create output directories
        self.horizontal_output_dir = self.output_directory / "horizontal_groups"
        self.vertical_output_dir = self.output_directory / "vertical_groups"
        os.makedirs(self.horizontal_output_dir, exist_ok=True)
        os.makedirs(self.vertical_output_dir, exist_ok=True)
        os.makedirs(self.output_directory, exist_ok=True)

        if not self.source_file.exists():
            raise FileNotFoundError(f"Source file not found: {self.source_file}")

    def should_run_horizontal(self):
        """Determine if horizontal grouping should be processed"""
        # Run horizontal if:
        # 1. Horizontal column is explicitly specified, OR
        # 2. Any horizontal-specific prefix/suffix is provided
        return (self.horizontal_key_column is not None or 
                self.horizontal_inner_prefix or 
                self.horizontal_outer_prefix or 
                self.horizontal_data_suffix)
    
    def should_run_vertical(self):
        """Determine if vertical grouping should be processed"""
        # Run vertical if:
        # 1. Vertical row is explicitly specified, OR  
        # 2. Any vertical-specific prefix/suffix is provided
        return (self.vertical_key_row is not None or
                self.vertical_inner_prefix or
                self.vertical_outer_prefix or
                self.vertical_data_suffix)

    def load_data_sheets(self):
        """Load all sheets from the Excel file"""
        try:
            # Discover sheets
            excel_file = pd.ExcelFile(self.source_file)
            self.sheet_identifiers = excel_file.sheet_names
            
            if not self.sheet_identifiers:
                raise ValueError("No sheets found in the source file")
            
            logger.info(f"Found {len(self.sheet_identifiers)} sheets: {self.sheet_identifiers}")
            
            # Load each sheet
            for sheet_name in self.sheet_identifiers:
                try:
                    logger.info(f"Loading sheet: '{sheet_name}'")
                    sheet_data = pd.read_excel(
                        self.source_file,
                        sheet_name=sheet_name,
                        header=None,
                        keep_default_na=False,
                        dtype=str
                    )
                    
                    if sheet_data.empty:
                        logger.warning(f"Sheet '{sheet_name}' is empty, skipping...")
                        continue
                    
                    self.data_sheets[sheet_name] = sheet_data
                    logger.info(f"Loaded sheet '{sheet_name}': {len(sheet_data)} rows x {len(sheet_data.columns)} columns")
                    
                except Exception as e:
                    logger.error(f"Error loading sheet '{sheet_name}': {e}")
                    continue
            
            if not self.data_sheets:
                raise ValueError("No valid sheets could be loaded")
                
        except Exception as e:
            logger.error(f"Error reading source file: {e}")
            raise

    def apply_inner_prefix(self, text, prefix):
        """Apply inner prefix to text with proper spacing"""
        if not prefix:
            return text
        
        # If prefix doesn't end with space or underscore, add space
        if prefix[-1] not in [' ', '_']:
            return f"{prefix} {text}"
        else:
            return f"{prefix}{text}"

    def apply_outer_prefix_suffix(self, text, prefix, suffix):
        """Apply outer prefix and suffix to text"""
        result = text
        if prefix:
            result = f"{prefix}{result}"
        if suffix:
            result = f"{result}{suffix}"
        return result.upper()

    def process_horizontal_grouping(self, sheet_name, sheet_data, output_dir):
        """
        Horizontal grouping: Groups rows by values in a key column
        Example: Group all products by their category
        """
        try:
            logger.info(f"Processing sheet '{sheet_name}' - HORIZONTAL grouping")
            
            # Determine grouping column
            key_column = self.horizontal_key_column
            if key_column is None:
                # Use first non-skipped column as default
                key_column = 0
                while key_column in self.skip_columns:
                    key_column += 1
                logger.info(f"Auto-selected column {key_column} for grouping")
            elif isinstance(key_column, str):
                try:
                    key_column = list(sheet_data.columns).index(key_column)
                except ValueError:
                    logger.error(f"Column '{self.horizontal_key_column}' not found")
                    return False

            # Find unique values in key column (skip specified rows)
            unique_keys = set()
            for row_idx in range(len(sheet_data)):
                if row_idx in self.skip_rows:
                    continue
                if key_column < len(sheet_data.columns):
                    value = str(sheet_data.iloc[row_idx, key_column]).strip()
                    if value and value.lower() != 'nan':
                        unique_keys.add(value)
            
            logger.info(f"Found {len(unique_keys)} unique keys: {list(unique_keys)}")
            logger.info(f"Key column {key_column} will be skipped from data processing (used for grouping)")
            logger.info(f"Skipping columns: {self.skip_columns}")
            logger.info(f"Skipping rows: {self.skip_rows}")
            
            # Process each group
            for group_key in unique_keys:
                # Apply outer prefix/suffix
                json_key = self.apply_outer_prefix_suffix(
                    group_key, 
                    self.horizontal_outer_prefix, 
                    self.horizontal_data_suffix
                )
                
                group_data = {}
                
                # Collect data for this group
                for row_idx in range(len(sheet_data)):
                    if row_idx in self.skip_rows:
                        continue
                    
                    row_key = str(sheet_data.iloc[row_idx, key_column]).strip()
                    if row_key != group_key:
                        continue
                        
                    # Process each column (skip the key column and specified skip columns)
                    for col_idx in range(len(sheet_data.columns)):
                        if col_idx in self.skip_columns or col_idx == key_column:
                            continue
                        
                        # Get column header
                        header = str(sheet_data.iloc[0, col_idx]).strip()
                        if not header or header.lower() == 'nan':
                            header = f"Column_{col_idx}"
                        
                        # Apply inner prefix
                        header = self.apply_inner_prefix(header, self.horizontal_inner_prefix)
                        logger.debug(f"Horizontal header after prefix: '{header}'")
                        
                        # Get cell value
                        value = str(sheet_data.iloc[row_idx, col_idx]).strip()
                        if value and value.lower() != 'nan':
                            lines = [line.strip() for line in value.split('\n') if line.strip()]
                            if header not in group_data:
                                group_data[header] = []
                            group_data[header].extend(lines)
                
                # Save JSON file
                if group_data:
                    output_data = {json_key: group_data}
                    filename = self.sanitize_filename(group_key) + ".json"
                    filepath = output_dir / filename
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(output_data, f, indent=2, ensure_ascii=False)
                    logger.info(f"Saved: {filepath}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error in horizontal grouping: {e}")
            return False

    def process_vertical_grouping(self, sheet_name, sheet_data, output_dir):
        """
        Vertical grouping: Groups columns by values in a key row
        Example: Group specifications by category (AUDIO, BATTERY, etc.)
        """
        try:
            logger.info(f"Processing sheet '{sheet_name}' - VERTICAL grouping")
            logger.info(f"Using vertical inner prefix: '{self.vertical_inner_prefix}'")
            logger.info(f"Using vertical outer prefix: '{self.vertical_outer_prefix}'")
            
            # Determine grouping row
            key_row = self.vertical_key_row
            if key_row is None:
                # Use first non-skipped row as default
                key_row = 0
                while key_row in self.skip_rows:
                    key_row += 1
                logger.info(f"Auto-selected row {key_row} for grouping")

            if key_row >= len(sheet_data):
                logger.warning(f"Row {key_row} is out of range")
                return False

            # Find unique values in key row (skip specified columns)
            unique_keys = set()
            for col_idx in range(len(sheet_data.columns)):
                if col_idx in self.skip_columns:
                    continue
                value = str(sheet_data.iloc[key_row, col_idx]).strip()
                if value and value.lower() != 'nan':
                    unique_keys.add(value)
            
            logger.info(f"Found {len(unique_keys)} unique keys: {list(unique_keys)}")
            logger.info(f"Key row {key_row} will be skipped from data processing (used for grouping)")
            logger.info(f"Skipping columns: {self.skip_columns}")
            logger.info(f"Skipping rows: {self.skip_rows}")
            
            # Process each group
            for group_key in unique_keys:
                # Apply outer prefix/suffix
                json_key = self.apply_outer_prefix_suffix(
                    group_key, 
                    self.vertical_outer_prefix, 
                    self.vertical_data_suffix
                )
                
                group_data = {}
                
                # Collect data for this group
                for col_idx in range(len(sheet_data.columns)):
                    if col_idx in self.skip_columns:
                        continue
                    
                    col_key = str(sheet_data.iloc[key_row, col_idx]).strip()
                    if col_key != group_key:
                        continue
                        
                    # Process each row (skip rows before skip_rows and skip the key row since it's used for grouping)
                    for row_idx in range(len(sheet_data)):
                        if row_idx in self.skip_rows or row_idx == key_row:
                            continue
                        
                        # Get row label from the label column
                        label_col = 0  # Use first column as default label column
                        while label_col in self.skip_columns:
                            label_col += 1
                            
                        if self.horizontal_key_column is not None:
                            if isinstance(self.horizontal_key_column, str):
                                try:
                                    label_col = list(sheet_data.columns).index(self.horizontal_key_column)
                                except ValueError:
                                    # Keep the default if column not found
                                    pass
                            else:
                                label_col = self.horizontal_key_column
                        
                        row_label = str(sheet_data.iloc[row_idx, label_col]).strip()
                        logger.debug(f"Row {row_idx}, Col {label_col}: Original label = '{row_label}'")
                        
                        if not row_label or row_label.lower() == 'nan':
                            row_label = f"Row_{row_idx}"
                        
                        # Apply inner prefix
                        original_label = row_label
                        row_label = self.apply_inner_prefix(row_label, self.vertical_inner_prefix)
                        logger.debug(f"Vertical label: '{original_label}' -> '{row_label}'")
                        
                        # Get cell value
                        value = str(sheet_data.iloc[row_idx, col_idx]).strip()
                        if value and value.lower() != 'nan':
                            lines = [line.strip() for line in value.split('\n') if line.strip()]
                            if row_label not in group_data:
                                group_data[row_label] = []
                            group_data[row_label].extend(lines)
                
                # Save JSON file
                if group_data:
                    output_data = {json_key: group_data}
                    filename = self.sanitize_filename(group_key) + ".json"
                    filepath = output_dir / filename
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(output_data, f, indent=2, ensure_ascii=False)
                    logger.info(f"Saved: {filepath}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error in vertical grouping: {e}")
            return False

    def sanitize_filename(self, name):
        """Convert string to safe filename"""
        return str(name).lower().replace(' ', '_').replace('/', '_').replace('\\', '_').replace(':', '_').replace('*', '_').replace('?', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_')

    def process(self):
        """Main processing function"""
        try:
            # Load data
            self.load_data_sheets()
            
            # Determine which processing modes to run based on input parameters
            run_horizontal = self.should_run_horizontal()
            run_vertical = self.should_run_vertical()
            
            if not run_horizontal and not run_vertical:
                logger.warning("No processing mode selected! Please specify parameters for horizontal or vertical grouping.")
                logger.info("For horizontal grouping: specify -hc (horizontal column) or use -hip/-hop (horizontal prefixes)")
                logger.info("For vertical grouping: specify -vr (vertical row) or use -vip/-vop (vertical prefixes)")
                return False
            
            logger.info(f"Processing modes: Horizontal={run_horizontal}, Vertical={run_vertical}")
            
            success_count = 0
            
            # Process each sheet
            for sheet_name, sheet_data in self.data_sheets.items():
                sheet_success = False
                
                # Run horizontal grouping if requested
                if run_horizontal:
                    h_dir = self.horizontal_output_dir / self.sanitize_filename(sheet_name)
                    os.makedirs(h_dir, exist_ok=True)
                    h_success = self.process_horizontal_grouping(sheet_name, sheet_data, h_dir)
                    sheet_success = sheet_success or h_success
                
                # Run vertical grouping if requested  
                if run_vertical:
                    v_dir = self.vertical_output_dir / self.sanitize_filename(sheet_name)
                    os.makedirs(v_dir, exist_ok=True)
                    v_success = self.process_vertical_grouping(sheet_name, sheet_data, v_dir)
                    sheet_success = sheet_success or v_success
                
                if sheet_success:
                    success_count += 1
            
            # Save summary
            summary = {
                "source_file": str(self.source_file),
                "sheets_processed": success_count,
                "total_sheets": len(self.sheet_identifiers),
                "processing_modes": {
                    "horizontal": run_horizontal,
                    "vertical": run_vertical
                },
                "configuration": {
                    "skip_columns": self.skip_columns,
                    "skip_rows": self.skip_rows,
                    "horizontal_key_column": self.horizontal_key_column,
                    "vertical_key_row": self.vertical_key_row,
                    "vertical_inner_prefix": self.vertical_inner_prefix,
                    "vertical_outer_prefix": self.vertical_outer_prefix,
                    "horizontal_inner_prefix": self.horizontal_inner_prefix,
                    "horizontal_outer_prefix": self.horizontal_outer_prefix
                }
            }
            
            summary_file = self.output_directory / "processing_summary.json"
            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2)
            
            logger.info(f"Processing complete! Summary saved to: {summary_file}")
            return success_count > 0
            
        except Exception as e:
            logger.error(f"Processing failed: {e}")
            return False


def main():
    """Command-line interface"""
    parser = argparse.ArgumentParser(description="Convert Excel data to JSON with grouping")
    
    # Required
    parser.add_argument('-s', '--source', required=True, help="Source Excel file")
    
    # Optional
    parser.add_argument('-o', '--output', default='processed_data', help="Output directory")
    parser.add_argument('-hc', '--horizontal-column', type=str, help="Column for horizontal grouping")
    parser.add_argument('-vr', '--vertical-row', type=int, help="Row for vertical grouping")
    parser.add_argument('-sc', '--skip-columns', type=str, default='', help="Skip columns (comma-separated list, e.g., '0,2,5' or single number for backwards compatibility)")
    parser.add_argument('-sr', '--skip-rows', type=str, default='', help="Skip rows (comma-separated list, e.g., '0,1,3' or single number for backwards compatibility)")
    
    # Prefixes for inner keys (element names)
    parser.add_argument('-hip', '--horizontal-inner-prefix', default='', help="Prefix for horizontal inner keys")
    parser.add_argument('-vip', '--vertical-inner-prefix', default='', help="Prefix for vertical inner keys")
    
    # Prefixes for outer keys (group names)
    parser.add_argument('-hop', '--horizontal-outer-prefix', default='', help="Prefix for horizontal outer keys")
    parser.add_argument('-vop', '--vertical-outer-prefix', default='', help="Prefix for vertical outer keys")
    
    # Suffixes
    parser.add_argument('-hs', '--horizontal-suffix', default='', help="Suffix for horizontal outer keys")
    parser.add_argument('-vs', '--vertical-suffix', default='', help="Suffix for vertical outer keys")
    
    args = parser.parse_args()
    
    # Debug: Print the arguments
    logger.info(f"Arguments received:")
    logger.info(f"  source: {args.source}")
    logger.info(f"  vertical_inner_prefix: '{args.vertical_inner_prefix}'")
    logger.info(f"  horizontal_inner_prefix: '{args.horizontal_inner_prefix}'")
    logger.info(f"  skip_columns: {args.skip_columns}")
    logger.info(f"  vertical_row: {args.vertical_row}")
    
    # Convert skip parameters
    skip_columns = args.skip_columns
    skip_rows = args.skip_rows
    
    # Handle backwards compatibility - if it's a single number, treat as old behavior
    if skip_columns and skip_columns.isdigit():
        skip_columns = int(skip_columns)
    
    if skip_rows and skip_rows.isdigit():
        skip_rows = int(skip_rows)
    
    # Convert column to int if numeric
    horizontal_column = args.horizontal_column
    if horizontal_column and horizontal_column.isdigit():
        horizontal_column = int(horizontal_column)
    
    try:
        processor = DataTableProcessor(
            source_file=args.source,
            output_directory=args.output,
            horizontal_key_column=horizontal_column,
            vertical_key_row=args.vertical_row,
            skip_columns=skip_columns,
            skip_rows=skip_rows,
            horizontal_inner_prefix=args.horizontal_inner_prefix,
            vertical_inner_prefix=args.vertical_inner_prefix,
            horizontal_outer_prefix=args.horizontal_outer_prefix,
            vertical_outer_prefix=args.vertical_outer_prefix,
            horizontal_data_suffix=args.horizontal_suffix,
            vertical_data_suffix=args.vertical_suffix
        )
        
        if processor.process():
            logger.info("Success! Check the output directory for results.")
        else:
            logger.error("Processing failed!")
            
    except Exception as e:
        logger.error(f"Error: {e}")


if __name__ == "__main__":
    main()