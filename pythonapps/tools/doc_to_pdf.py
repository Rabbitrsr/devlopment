import pandas as pd
import argparse
import logging
import json
import os
from pathlib import Path

# Configure logging to display timestamps and log levels
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class DataTableProcessor:
    """
    A generic data table processor that converts tabular data (Excel/CSV) to JSON format.
    
    This processor supports two grouping modes:
    
    1. HORIZONTAL GROUPING (Row-Column Mode):
       - Groups rows by unique values found in a specified KEY COLUMN
       - Each unique value in the key column creates a separate JSON file
       - All rows with the same key value are collected into that file
       - Column headers (from row 0) become the JSON field names
       - Automatically skips NaN/empty values in the key column
       - Can skip multiple columns from the start (e.g., index columns)
       - Optional suffix can be appended to the group key in JSON output
    
    2. VERTICAL GROUPING (Column-Row Mode):
       - Groups columns by unique values found in a specified KEY ROW
       - Each unique value in the key row creates a separate JSON file
       - All columns with the same key value are collected into that file
       - Row labels (from the first non-skipped column) become the JSON field names
       - Automatically skips NaN/empty values in the key row
       - Can skip multiple rows from the start (e.g., header rows)
       - Optional suffix can be appended to the group key in JSON output
    
    Example Excel structure for horizontal grouping:
    | Skip | Category | Product | Price | Stock |
    |------|----------|---------|-------|-------|
    | idx1 | Fruits   | Apple   | $1.00 | 100   |
    | idx2 | Fruits   | Banana  | $0.50 | 200   |
    | idx3 | Veggies  | Carrot  | $0.75 | 150   |
    
    With horizontal_key_column=1 (Category), creates:
    - fruits.json: contains all fruit products
    - veggies.json: contains all vegetable products
    """
    
    def __init__(self, 
                 source_file, 
                 output_directory="processed_data", 
                 horizontal_key_column=None,
                 vertical_key_row=None,
                 skip_columns=0,
                 skip_rows=0,
                 horizontal_file_prefix="H_",
                 vertical_file_prefix="V_",
                 horizontal_data_suffix="",
                 vertical_data_suffix=""):
        """
        Initialize the processor with configuration parameters.
        
        Args:
            source_file: Path to the input file (Excel/CSV)
            output_directory: Directory to save processed JSON files
            
            horizontal_key_column: Column index/name that contains grouping keys for horizontal mode
                                 - Can be integer (0, 1, 2...) or string ("Category", "Type")
                                 - This column's values determine how rows are grouped
                                 - Each unique value creates a separate JSON file
                                 - Auto-detected as first non-skipped column if None
                                 
            vertical_key_row: Row index that contains grouping keys for vertical mode
                            - Must be integer (0, 1, 2...)
                            - This row's values determine how columns are grouped
                            - Each unique value creates a separate JSON file
                            - Auto-detected as first non-skipped row if None
                            
            skip_columns: Number of columns to skip from the start (default: 0)
                        - Useful for ignoring index/ID columns
                        - These columns won't be included in output JSON
                        - Key column can be after skipped columns
                        
            skip_rows: Number of rows to skip from the start (default: 0)
                     - Useful for ignoring metadata/header rows
                     - These rows won't be included in output JSON
                     - Key row can be after skipped rows
                     
            horizontal_file_prefix: Prefix added to filenames for horizontal group files
                                  - e.g., prefix="H_" creates files like "H_fruits.json"
                                  
            vertical_file_prefix: Prefix added to filenames for vertical group files
                                - e.g., prefix="V_" creates files like "V_2024.json"
            
            horizontal_data_suffix: Suffix appended to group keys in horizontal JSON output
                                  - e.g., if suffix="_DATA" and key="Fruits", JSON key becomes "FRUITS_DATA"
                                  
            vertical_data_suffix: Suffix appended to group keys in vertical JSON output
                                - e.g., if suffix="_DATA" and key="2024", JSON key becomes "2024_DATA"
        """
        # Convert paths to Path objects for better cross-platform compatibility
        self.source_file = Path(source_file)
        self.output_directory = Path(output_directory)
        
        # Store grouping configuration
        self.horizontal_key_column = horizontal_key_column
        self.vertical_key_row = vertical_key_row
        
        # Store skip configuration (for ignoring headers, indices, etc.)
        self.skip_columns = skip_columns
        self.skip_rows = skip_rows
        
        # Store naming configuration for output files
        self.horizontal_file_prefix = horizontal_file_prefix
        self.vertical_file_prefix = vertical_file_prefix
        self.horizontal_data_suffix = horizontal_data_suffix
        self.vertical_data_suffix = vertical_data_suffix
        
        # Initialize containers for sheet data
        self.data_sheets = {}  # Dictionary to store DataFrames for each sheet
        self.sheet_identifiers = []  # List of sheet names in the Excel file

        # Create output directory structure
        # Main output directory
        #   ├── horizontal_groups/  (contains subdirectories for each sheet)
        #   ├── vertical_groups/    (contains subdirectories for each sheet)
        #   └── processing_summary.json
        self.horizontal_output_dir = self.output_directory / "horizontal_groups"
        self.vertical_output_dir = self.output_directory / "vertical_groups"
        os.makedirs(self.horizontal_output_dir, exist_ok=True)
        os.makedirs(self.vertical_output_dir, exist_ok=True)
        os.makedirs(self.output_directory, exist_ok=True)

        # Validate source file exists
        if not self.source_file.exists():
            raise FileNotFoundError(f"Source file not found: {self.source_file}")

    def discover_sheets(self):
        """
        Discover all available data sheets in the source file.
        
        This method identifies all sheets in an Excel file, which is useful when
        processing multi-sheet workbooks. For CSV files, this would return a single sheet.
        
        Returns:
            list: Names of all sheets found in the source file
            
        Raises:
            ValueError: If no sheets are found in the file
            Exception: If there's an error reading the file
        """
        try:
            # Use pandas ExcelFile to get sheet information without loading data
            data_container = pd.ExcelFile(self.source_file)
            self.sheet_identifiers = data_container.sheet_names
            
            # Validate that at least one sheet exists
            if not self.sheet_identifiers:
                raise ValueError("No data sheets found in the source file")
            
            logger.info(f"Discovered {len(self.sheet_identifiers)} data sheets: {self.sheet_identifiers}")
            return self.sheet_identifiers
            
        except Exception as e:
            logger.error(f"Error discovering data sheets: {e}")
            raise

    def load_data_sheets(self):
        """
        Load data from all sheets in the source file.
        
        This method reads each sheet into a pandas DataFrame with specific settings:
        - header=None: Treats all rows as data (no automatic header detection)
        - keep_default_na=False: Preserves empty strings instead of converting to NaN
        - dtype=str: Reads all data as strings to preserve original formatting
        
        The method continues processing even if individual sheets fail to load,
        ensuring partial processing is possible for problematic files.
        """
        try:
            # First discover what sheets are available
            self.discover_sheets()
            
            # Iterate through each sheet and attempt to load it
            for sheet_id in self.sheet_identifiers:
                try:
                    logger.info(f"Loading data sheet: '{sheet_id}'")
                    
                    # Read sheet with specific parameters to preserve data integrity
                    sheet_content = pd.read_excel(
                        self.source_file,
                        sheet_name=sheet_id,
                        header=None,  # Don't automatically detect headers
                        keep_default_na=False,  # Keep empty strings as-is
                        dtype=str  # Read everything as string to preserve formatting
                    )
                    
                    # Skip empty sheets
                    if sheet_content.empty:
                        logger.warning(f"Data sheet '{sheet_id}' is empty, skipping...")
                        continue
                    
                    # Store the loaded sheet
                    self.data_sheets[sheet_id] = sheet_content
                    logger.info(f"Successfully loaded sheet '{sheet_id}' with {len(sheet_content)} rows and {len(sheet_content.columns)} columns")
                    
                except Exception as e:
                    # Log error but continue with other sheets
                    logger.error(f"Error loading sheet '{sheet_id}': {e}")
                    continue
            
            # Ensure at least one sheet was loaded successfully
            if not self.data_sheets:
                raise ValueError("No valid data sheets could be loaded from the source file")
                
        except Exception as e:
            logger.error(f"Error reading source file: {e}")
            raise

    def process_horizontal_grouping(self, sheet_identifier, sheet_data, output_subdir):
        """
        Process data sheet for horizontal grouping (group rows by key column values).
        
        HORIZONTAL GROUPING LOGIC:
        1. Identifies a KEY COLUMN that contains grouping values (e.g., "Category", "Type")
        2. Finds all unique values in that column (automatically skipping NaN/empty)
        3. For each unique value, creates a JSON file containing all rows with that value
        4. Uses first row (row 0) as column headers for JSON field names
        
        Example:
        If key column contains ["Fruits", "Fruits", "Veggies", "Veggies"], 
        creates 2 files: fruits.json and veggies.json
        
        The output JSON structure for each group will be:
        {
            "GROUP_KEY[suffix]": {
                "Column1_Header": ["row1_value", "row2_value", ...],
                "Column2_Header": ["row1_value", "row2_value", ...],
                ...
            }
        }
        
        Features:
        - Automatically skips NaN/empty values in the key column
        - Can skip multiple columns from start (they won't appear in output)
        - Handles multi-line cell content by splitting into arrays
        - Key column itself is excluded from the output data
        
        Args:
            sheet_identifier: Name of the sheet being processed
            sheet_data: DataFrame containing the sheet data
            output_subdir: Directory path where output files should be saved
            
        Returns:
            bool: True if processing was successful, False otherwise
        """
        try:
            logger.info(f"Processing sheet: '{sheet_identifier}' (HORIZONTAL grouping)")
            
            # Determine which column to use for grouping
            grouping_column = self.horizontal_key_column
            if grouping_column is None:
                # Auto-select first non-skipped column if not specified
                if len(sheet_data.columns) <= self.skip_columns:
                    logger.warning(f"Sheet '{sheet_identifier}' has insufficient columns for horizontal grouping, skipping...")
                    return False
                grouping_column = self.skip_columns
                logger.info(f"Auto-selected grouping column for sheet '{sheet_identifier}': column {grouping_column}")
            elif isinstance(grouping_column, str):
                # Convert column name to index if string was provided
                try:
                    grouping_column = list(sheet_data.columns).index(grouping_column)
                except ValueError:
                    logger.error(f"Grouping column '{self.horizontal_key_column}' not found in sheet '{sheet_identifier}'")
                    return False

            # Extract all unique values from the grouping column
            # CORE FUNCTIONALITY: Skip NaN and empty values automatically
            unique_group_keys = set()
            for row_index in range(self.skip_rows, len(sheet_data)):
                if grouping_column < len(sheet_data.columns):
                    key_value = str(sheet_data.iloc[row_index, grouping_column]).strip()
                    # Filter out empty or NaN values - this is essential for clean grouping
                    if key_value and key_value.lower() != 'nan':
                        unique_group_keys.add(key_value)
            
            logger.info(f"Sheet '{sheet_identifier}' - Found {len(unique_group_keys)} unique horizontal keys: {list(unique_group_keys)}")
            
            # Process each unique group key to create separate JSON files
            for group_key in unique_group_keys:
                group_data = []
                # Apply suffix to group key if configured
                formatted_group_key = f"{group_key}{self.horizontal_data_suffix}".upper() if self.horizontal_data_suffix else group_key.upper()
                element_data = {}  # Dictionary to store all data for this group
                
                # Extract all rows that belong to this group
                for row_index in range(self.skip_rows, len(sheet_data)):
                    if grouping_column >= len(sheet_data.columns):
                        continue
                        
                    # Check if this row belongs to the current group
                    current_key = str(sheet_data.iloc[row_index, grouping_column]).strip()
                    if current_key != group_key:
                        continue
                        
                    # Process each column in the row (except skipped and grouping columns)
                    for col_index in range(len(sheet_data.columns)):
                        if col_index < self.skip_columns or col_index == grouping_column:
                            continue
                        
                        # Use the first row as column headers
                        # This assumes the first row contains column names
                        header_row_index = 0  # Use first row as header
                        element_name = str(sheet_data.iloc[header_row_index, col_index]).strip()
                        if not element_name or element_name.lower() == 'nan':
                            # Fallback to generic column name if header is empty
                            element_name = f"Column_{col_index}"
                        
                        # Get the cell value
                        cell_content = str(sheet_data.iloc[row_index, col_index]).strip()
                        if not cell_content or cell_content.lower() == 'nan':
                            continue
                        
                        # Split multi-line content into separate array elements
                        content_lines = [line.strip() for line in str(cell_content).split('\n') if line.strip()]
                        
                        # Initialize array for this element if not exists
                        if element_name not in element_data:
                            element_data[element_name] = []
                        
                        # Add content lines to the element's array
                        element_data[element_name].extend(content_lines)
                
                # Create the final JSON structure with the group key as top-level key
                if element_data:
                    group_data = {formatted_group_key: element_data}
                
                # Save the group data to a JSON file
                if group_data:
                    # Sanitize filename to be filesystem-safe
                    safe_filename = self.sanitize_identifier(group_key)
                    # Apply horizontal prefix to filename
                    output_file = output_subdir / f"{self.horizontal_file_prefix}{safe_filename}.json"
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(group_data, f, indent=2, ensure_ascii=False)
                    logger.info(f"Saved horizontal group: {output_file}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error processing sheet '{sheet_identifier}' in horizontal mode: {e}")
            return False

    def process_vertical_grouping(self, sheet_identifier, sheet_data, output_subdir):
        """
        Process data sheet for vertical grouping (group columns by key row values).
        
        VERTICAL GROUPING LOGIC:
        1. Identifies a KEY ROW that contains grouping values (e.g., dates, locations)
        2. Finds all unique values in that row (automatically skipping NaN/empty)
        3. For each unique value, creates a JSON file containing all columns with that value
        4. Uses first non-skipped column as row labels for JSON field names
        
        Example:
        If key row contains ["2023", "2023", "2024", "2024"], 
        creates 2 files: 2023.json and 2024.json
        
        The output JSON structure for each group will be:
        {
            "GROUP_KEY[suffix]": {
                "Row1_Label": ["col1_value", "col2_value", ...],
                "Row2_Label": ["col1_value", "col2_value", ...],
                ...
            }
        }
        
        Features:
        - Automatically skips NaN/empty values in the key row
        - Can skip multiple rows from start (they won't appear in output)
        - Handles multi-line cell content by splitting into arrays
        - Key row itself is excluded from the output data
        
        Args:
            sheet_identifier: Name of the sheet being processed
            sheet_data: DataFrame containing the sheet data
            output_subdir: Directory path where output files should be saved
            
        Returns:
            bool: True if processing was successful, False otherwise
        """
        try:
            logger.info(f"Processing sheet: '{sheet_identifier}' (VERTICAL grouping)")
            
            # Determine which row to use for grouping
            grouping_row = self.vertical_key_row
            if grouping_row is None:
                # Auto-select first non-skipped row if not specified
                grouping_row = self.skip_rows
                logger.info(f"Auto-selected grouping row for sheet '{sheet_identifier}': row {grouping_row}")

            # Validate the grouping row exists
            if grouping_row >= len(sheet_data):
                logger.warning(f"Grouping row {grouping_row} is beyond data range for vertical grouping, skipping...")
                return False

            # Extract all unique values from the grouping row
            # CORE FUNCTIONALITY: Skip NaN and empty values automatically
            unique_group_keys = set()
            for col_index in range(self.skip_columns, len(sheet_data.columns)):
                key_value = str(sheet_data.iloc[grouping_row, col_index]).strip()
                # Filter out empty or NaN values - this is essential for clean grouping
                if key_value and key_value.lower() != 'nan':
                    unique_group_keys.add(key_value)
            
            logger.info(f"Sheet '{sheet_identifier}' - Found {len(unique_group_keys)} unique vertical keys: {list(unique_group_keys)}")
            
            # Process each unique group key to create separate JSON files
            for group_key in unique_group_keys:
                group_data = []
                # Apply suffix to group key if configured
                formatted_group_key = f"{group_key}{self.vertical_data_suffix}".upper() if self.vertical_data_suffix else group_key.upper()
                element_data = {}  # Dictionary to store all data for this group
                
                # Extract all columns that belong to this group
                for col_index in range(self.skip_columns, len(sheet_data.columns)):
                    # Check if this column belongs to the current group
                    current_key = str(sheet_data.iloc[grouping_row, col_index]).strip()
                    if current_key != group_key:
                        continue
                        
                    # Process each row in the column (except skipped and grouping rows)
                    for row_index in range(len(sheet_data)):
                        if row_index < self.skip_rows or row_index == grouping_row:
                            continue
                        
                        # Determine which column contains row labels/names
                        # This allows using either the configured column or auto-detecting
                        parameter_column = self.horizontal_key_column if self.horizontal_key_column is not None else self.skip_columns
                        if isinstance(parameter_column, str):
                            try:
                                parameter_column = list(sheet_data.columns).index(parameter_column)
                            except ValueError:
                                parameter_column = self.skip_columns
                        
                        # Get the row label from the parameter column
                        element_name = str(sheet_data.iloc[row_index, parameter_column]).strip()
                        if not element_name or element_name.lower() == 'nan':
                            # Fallback to generic row name if label is empty
                            element_name = f"Row_{row_index}"
                        
                        # Get the cell value
                        cell_content = str(sheet_data.iloc[row_index, col_index]).strip()
                        if not cell_content or cell_content.lower() == 'nan':
                            continue
                        
                        # Split multi-line content into separate array elements
                        content_lines = [line.strip() for line in str(cell_content).split('\n') if line.strip()]
                        
                        # Initialize array for this element if not exists
                        if element_name not in element_data:
                            element_data[element_name] = []
                        
                        # Add content lines to the element's array
                        element_data[element_name].extend(content_lines)
                
                # Create the final JSON structure with the group key as top-level key
                if element_data:
                    group_data = {formatted_group_key: element_data}
                
                # Save the group data to a JSON file
                if group_data:
                    # Sanitize filename to be filesystem-safe
                    safe_filename = self.sanitize_identifier(group_key)
                    # Apply vertical prefix to filename
                    output_file = output_subdir / f"{self.vertical_file_prefix}{safe_filename}.json"
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(group_data, f, indent=2, ensure_ascii=False)
                    logger.info(f"Saved vertical group: {output_file}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error processing sheet '{sheet_identifier}' in vertical mode: {e}")
            return False

    def process_data_sheet(self, sheet_identifier, sheet_data):
        """
        Process a single data sheet for both horizontal and vertical grouping.
        
        This method orchestrates the processing of a sheet in both modes,
        creating separate output directories for each mode and sheet combination.
        
        Directory structure created:
        output_directory/
        ├── horizontal_groups/
        │   └── sheet_name/
        │       ├── group1.json
        │       └── group2.json
        └── vertical_groups/
            └── sheet_name/
                ├── group1.json
                └── group2.json
        
        Args:
            sheet_identifier: Name of the sheet being processed
            sheet_data: DataFrame containing the sheet data
            
        Returns:
            bool: True if at least one grouping mode was successful, False if both failed
        """
        try:
            # Create sheet-specific subdirectories for organization
            horizontal_subdir = self.horizontal_output_dir / self.sanitize_identifier(sheet_identifier)
            vertical_subdir = self.vertical_output_dir / self.sanitize_identifier(sheet_identifier)
            os.makedirs(horizontal_subdir, exist_ok=True)
            os.makedirs(vertical_subdir, exist_ok=True)
            
            # Process both grouping methods independently
            # This allows partial success if one mode fails
            horizontal_success = self.process_horizontal_grouping(sheet_identifier, sheet_data, horizontal_subdir)
            vertical_success = self.process_vertical_grouping(sheet_identifier, sheet_data, vertical_subdir)
            
            # Return True if at least one mode succeeded
            return horizontal_success or vertical_success
            
        except Exception as e:
            logger.error(f"Error processing data sheet '{sheet_identifier}': {e}")
            return False

    def sanitize_identifier(self, identifier):
        """
        Sanitize identifier to be filesystem-safe.
        
        This method converts any string into a valid filename by:
        - Converting to lowercase for consistency
        - Replacing problematic characters with underscores
        
        Args:
            identifier: Original string that needs sanitization
            
        Returns:
            str: Sanitized string safe for use as a filename
        """
        # Replace all characters that are problematic in filenames across different OS
        return str(identifier).lower().replace(' ', '_').replace('/', '_').replace('\\', '_').replace(':', '_').replace('*', '_').replace('?', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_')

    def execute_processing(self):
        """
        Execute the complete data processing workflow.
        
        This is the main entry point that orchestrates the entire processing:
        1. Load all sheets from the source file
        2. Process each sheet in both horizontal and vertical modes
        3. Generate a summary report of the processing results
        
        The method continues processing even if individual sheets fail,
        ensuring maximum data extraction from partially corrupted files.
        
        Returns:
            bool: True if at least one sheet was processed successfully, False otherwise
        """
        try:
            # Step 1: Load all data sheets from the source file
            self.load_data_sheets()
            
            # Initialize counters for summary statistics
            successful_sheets = 0
            failed_sheets = 0
            
            # Step 2: Process each loaded sheet
            for sheet_identifier, sheet_data in self.data_sheets.items():
                if self.process_data_sheet(sheet_identifier, sheet_data):
                    successful_sheets += 1
                else:
                    failed_sheets += 1
            
            logger.info(f"Processing completed: {successful_sheets} sheets successful, {failed_sheets} sheets failed")
            
            # Step 3: Create a comprehensive processing summary
            # This helps users understand what was processed and how
            processing_summary = {
                "source_file": str(self.source_file),
                "processing_mode": "dual (horizontal + vertical grouping)",
                "total_sheets": len(self.sheet_identifiers),
                "processed_sheets": successful_sheets,
                "failed_sheets": failed_sheets,
                "sheet_identifiers": self.sheet_identifiers,
                "configuration": {
                    "horizontal_key_column": self.horizontal_key_column,
                    "vertical_key_row": self.vertical_key_row,
                    "skip_columns": self.skip_columns,
                    "skip_rows": self.skip_rows,
                    "horizontal_file_prefix": self.horizontal_file_prefix,
                    "vertical_file_prefix": self.vertical_file_prefix,
                    "horizontal_data_suffix": self.horizontal_data_suffix,
                    "vertical_data_suffix": self.vertical_data_suffix
                },
                "output_structure": {
                    "main_directory": str(self.output_directory),
                    "horizontal_groups": str(self.horizontal_output_dir),
                    "vertical_groups": str(self.vertical_output_dir)
                }
            }
            
            # Save the summary to help users understand the output
            summary_file = self.output_directory / "processing_summary.json"
            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(processing_summary, f, indent=2, ensure_ascii=False)
            logger.info(f"Processing summary saved to: {summary_file}")
            
            # Return success if at least one sheet was processed
            return successful_sheets > 0
            
        except Exception as e:
            logger.error(f"Error during processing execution: {e}")
            return False
    

def main():
    """
    Main entry point for command-line usage.
    
    This function sets up argument parsing and creates a DataTableProcessor
    instance based on command-line arguments.
    
    CORE FUNCTIONALITY EXAMPLES:
    
    1. HORIZONTAL GROUPING (Row-Column mode):
       python script.py -s data.xlsx -hc 1 -sc 1
       - Groups rows by values in column 1
       - Skips first column (e.g., index column)
       - Creates one JSON file per unique value in column 1
    
    2. VERTICAL GROUPING (Column-Row mode):
       python script.py -s data.xlsx -vr 0 -sr 1
       - Groups columns by values in row 0
       - Skips first row in output data
       - Creates one JSON file per unique value in row 0
    
    3. DUAL MODE with suffixes:
       python script.py -s data.xlsx -hc "Category" -vr 0 -hs "_PRODUCTS" -vs "_YEARS"
       - Horizontal: groups by "Category" column, adds "_PRODUCTS" to keys
       - Vertical: groups by row 0, adds "_YEARS" to keys
    
    4. SKIP MULTIPLE ROWS/COLUMNS:
       python script.py -s data.xlsx -sc 3 -sr 2
       - Skips first 3 columns (won't appear in any output)
       - Skips first 2 rows (won't appear in any output)
       - Auto-detects key column/row after skipped ones
    
    Note: NaN and empty values in key columns/rows are automatically skipped
    """
    # Set up command-line argument parser
    parser = argparse.ArgumentParser(description="Generic tabular data processor with dual-mode JSON conversion")
    
    # Required arguments
    parser.add_argument('-s', '--source', required=True, help="Source data file path")
    
    # Grouping configuration arguments
    parser.add_argument('-hc', '--horizontal-column', type=str, 
                       help="Column index/name for horizontal grouping (auto-detected if not provided)")
    parser.add_argument('-vr', '--vertical-row', type=int, 
                       help="Row index for vertical grouping (auto-detected if not provided)")
    
    # Skip configuration arguments
    parser.add_argument('-sc', '--skip-columns', type=int, default=0, 
                       help="Number of columns to skip from start (default: 0)")
    parser.add_argument('-sr', '--skip-rows', type=int, default=0, 
                       help="Number of rows to skip from start (default: 0)")
    
    # File naming configuration arguments
    parser.add_argument('-hp', '--horizontal-prefix', default='H_', 
                       help="Prefix for horizontal group files (default: 'H_')")
    parser.add_argument('-vp', '--vertical-prefix', default='V_', 
                       help="Prefix for vertical group files (default: 'V_')")
    
    # Data naming configuration arguments
    parser.add_argument('-hs', '--horizontal-suffix', default='', 
                       help="Suffix for horizontal data keys (optional)")
    parser.add_argument('-vs', '--vertical-suffix', default='', 
                       help="Suffix for vertical data keys (optional)")
    
    # Output configuration
    parser.add_argument('-o', '--output', default='processed_data', 
                       help="Output directory for processed files (default: 'processed_data')")

    args = parser.parse_args()

    # Convert horizontal column to int if it's numeric
    # This allows users to specify either column index (0, 1, 2) or column name ("Product_ID")
    horizontal_column = args.horizontal_column
    if horizontal_column and horizontal_column.isdigit():
        horizontal_column = int(horizontal_column)

    try:
        # Create processor instance with all configuration
        processor = DataTableProcessor(
            source_file=args.source,
            output_directory=args.output,
            horizontal_key_column=horizontal_column,
            vertical_key_row=args.vertical_row,
            skip_columns=args.skip_columns,
            skip_rows=args.skip_rows,
            horizontal_file_prefix=args.horizontal_prefix,
            vertical_file_prefix=args.vertical_prefix,
            horizontal_data_suffix=args.horizontal_suffix,
            vertical_data_suffix=args.vertical_suffix
        )

        # Execute the processing workflow
        success = processor.execute_processing()
        
        # Provide user-friendly completion messages
        if success:
            logger.info("Data processing completed successfully!")
            logger.info(f"Horizontal groups saved to: {processor.horizontal_output_dir}")
            logger.info(f"Vertical groups saved to: {processor.vertical_output_dir}")
        else:
            logger.error("Data processing failed!")
    except Exception as e:
        logger.error(f"Error: {e}")


if __name__ == "__main__":
    # Execute main function when script is run directly
    main()