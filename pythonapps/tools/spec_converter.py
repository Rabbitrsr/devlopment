"""
Excel to Specification Files Converter
Author: Assistant
Date: 2023-08-02
"""

import pandas as pd
import argparse
import logging
import re
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SpecsConverter:
    def __init__(self, input_file, sheet_name, output_dir):
        self.input_file = Path(input_file)
        self.sheet_name = sheet_name
        self.output_dir = Path(output_dir)
        self.df = None

        # Validate paths
        if not self.input_file.exists():
            raise FileNotFoundError(f"Input file not found: {self.input_file}")

        self.output_dir.mkdir(parents=True, exist_ok=True)

    def clean_filename(self, name):
        """Sanitize filename by removing special characters"""
        return re.sub(r'[^\w\s-]', '', name).strip().replace(' ', '_')

    def load_data(self):
        """Load and validate Excel data"""
        try:
            self.df = pd.read_excel(
                self.input_file,
                sheet_name=self.sheet_name,
                header=0,
                keep_default_na=False
            )

            # Validate required columns
            required_columns = ['S.No', 'PARAMETER']
            if not all(col in self.df.columns for col in required_columns):
                missing = set(required_columns) - set(self.df.columns)
                raise ValueError(f"Missing required columns: {missing}")

            logger.info(f"Successfully loaded data from {self.input_file}")

        except Exception as e:
            logger.error(f"Error loading Excel file: {e}")
            raise

    def process_parameter(self, parameter_row):
        """Process a single parameter row"""
        try:
            parameter_name = parameter_row['PARAMETER'].strip()
            if not parameter_name or parameter_name == 'PARAMETER':
                return  # Skip header row

            logger.info(f"Processing parameter: {parameter_name}")

            output_lines = []

            # Iterate through models (columns)
            for model in self.df.columns[2:]:  # Skip S.No and PARAMETER columns
                spec = parameter_row[model]
                if not spec or str(spec).lower() == 'nan':
                    continue  # Skip empty specs

                # Format model entry
                output_lines.append(f"Model Name : {model}")
                output_lines.append(f"{model} {parameter_name}:")

                lines = str(spec).split('\n')
                lines = [line.strip() for line in lines if line.strip()]  # Clean and skip empty lines

                if lines:
                    first_line = lines[0]
                    if len(lines) == 1:
                        output_lines.append(f"- {parameter_name} {first_line}")
                    else:
                        for line in lines[1:]:
                            output_lines.append(f"- {first_line} {line}")

                output_lines.append("##end##")  # Add empty line between models

            # Generate output file
            if output_lines:
                filename = self.clean_filename(parameter_name) + ".txt"
                output_path = self.output_dir / filename

                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(output_lines))

                logger.info(f"Created file: {output_path}")

        except Exception as e:
            logger.error(f"Error processing parameter {parameter_name}: {e}")
            raise

    def convert_all(self):
        """Convert all parameters in the sheet"""
        try:
            self.load_data()

            for _, row in self.df.iterrows():
                self.process_parameter(row)

            logger.info("Conversion completed successfully")

        except Exception as e:
            logger.error(f"Conversion failed: {e}")
            raise

def main():
    parser = argparse.ArgumentParser(
        description="Convert Excel specifications to text files"
    )
    parser.add_argument(
        '-i', '--input',
        required=True,
        help="Path to input Excel file"
    )
    parser.add_argument(
        '-s', '--sheet',
        default="Master Comparison",
        help="Sheet name to process (default: 'Master Comparison')"
    )
    parser.add_argument(
        '-o', '--output',
        default="specs_output",
        help="Output directory (default: 'specs_output')"
    )

    args = parser.parse_args()

    try:
        converter = SpecsConverter(
            input_file=args.input,
            sheet_name=args.sheet,
            output_dir=args.output
        )
        converter.convert_all()

    except Exception as e:
        logger.error(f"Fatal error: {e}")
        exit(1)

if __name__ == "__main__":
    main()