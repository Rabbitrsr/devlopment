"""
Flexible Excel Specifications Extractor (JSON Version with Array Format)

This script reads an Excel sheet and writes each parameter's data to a separate JSON file,
where each model's spec value is always stored as a list, even if it has only one item.
"""

import pandas as pd
import argparse
import logging
import re
import json
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class FlexibleExcelExtractor:
    """Extracts specifications from Excel with flexible column structure"""

    def __init__(self, excel_file, sheet_name, output_folder, parameter_col=None, skip_cols=1):
        self.excel_file = Path(excel_file)
        self.sheet_name = sheet_name
        self.output_folder = Path(output_folder)
        self.parameter_col = parameter_col
        self.skip_cols = skip_cols
        self.data = None

        if not self.excel_file.exists():
            raise FileNotFoundError(f"Excel file not found: {self.excel_file}")

        self.output_folder.mkdir(parents=True, exist_ok=True)

    def make_safe_filename(self, text):
        """Sanitize filename"""
        return re.sub(r'[^\w\s-]', '', text).strip().replace(' ', '_')

    def read_excel(self):
        """Read the Excel file and load the sheet"""
        try:
            self.data = pd.read_excel(
                self.excel_file,
                sheet_name=self.sheet_name,
                header=0,
                keep_default_na=False
            )

            if self.parameter_col is None:
                if len(self.data.columns) < 2:
                    raise ValueError("Not enough columns in the Excel file")
                self.parameter_col = self.data.columns[1]
                logger.info(f"Auto-selected parameter column: {self.parameter_col}")

            if self.parameter_col not in self.data.columns:
                raise ValueError(f"Parameter column '{self.parameter_col}' not found.")

            logger.info(f"Loaded sheet '{self.sheet_name}' from {self.excel_file}")
            logger.info(f"Detected {len(self.data.columns) - self.skip_cols - 1} model columns")

        except Exception as e:
            logger.error(f"Failed to read Excel file: {e}")
            raise

    def process_row(self, row):
        """Process a single parameter row and write it as JSON"""
        try:
            parameter_name = str(row[self.parameter_col]).strip()
            if not parameter_name or parameter_name.lower() == self.parameter_col.lower():
                return

            logger.info(f"Processing parameter: {parameter_name}")

            model_spec_map = {}

            for col_idx, model in enumerate(self.data.columns):
                if col_idx <= self.skip_cols or model == self.parameter_col:
                    continue

                spec_value = row[model]
                if not spec_value or str(spec_value).lower() == 'nan':
                    continue

                # Always convert spec value to a list (even if only one item)
                lines = str(spec_value).split('\n')
                lines = [line.strip() for line in lines if line.strip()]
                model_spec_map[model] = lines

            if model_spec_map:
                filename = self.make_safe_filename(parameter_name) + ".json"
                output_file = self.output_folder / filename

                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump({parameter_name: model_spec_map}, f, indent=2, ensure_ascii=False)

                logger.info(f"Created JSON file: {output_file}")

        except Exception as e:
            logger.error(f"Error processing row for parameter '{parameter_name}': {e}")
            raise

    def extract_all(self):
        """Extract specs for all parameters in the sheet"""
        try:
            self.read_excel()

            for _, row in self.data.iterrows():
                self.process_row(row)

            logger.info("✅ All parameters extracted to JSON successfully.")

        except Exception as e:
            logger.error(f"Extraction failed: {e}")
            raise


def main():
    parser = argparse.ArgumentParser(
        description="Convert Excel spec sheet to JSON files per parameter (array format)"
    )
    parser.add_argument(
        '-i', '--input',
        required=True,
        help="Path to the input Excel file"
    )
    parser.add_argument(
        '-s', '--sheet',
        default="Sheet1",
        help="Sheet name (default: Sheet1)"
    )
    parser.add_argument(
        '-o', '--output',
        default="spec_json",
        help="Output folder for JSON files"
    )
    parser.add_argument(
        '-p', '--parameter-column',
        help="Name of the column containing parameter names"
    )
    parser.add_argument(
        '-k', '--skip-columns',
        type=int,
        default=1,
        help="Number of initial columns to skip (default: 1)"
    )

    args = parser.parse_args()

    extractor = FlexibleExcelExtractor(
        excel_file=args.input,
        sheet_name=args.sheet,
        output_folder=args.output,
        parameter_col=args.parameter_column,
        skip_cols=args.skip_columns
    )

    extractor.extract_all()


if __name__ == "__main__":
    main()
