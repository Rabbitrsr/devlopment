import os
import sys
import win32com.client

def convert_to_pdf(input_file, output_file):
    try:
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        word.DisplayAlerts = 0  # No alerts
        doc = word.Documents.Open(input_file)
        doc.SaveAs(output_file, FileFormat=17)  # 17 is PDF
        doc.Close()
        word.Quit()
        print(f"✔️ Converted: {input_file} -> {output_file}")
    except Exception as e:
        print(f"❌ Error converting {input_file}: {e}")

def process_directory_recursively(dir_path):
    for root, _, files in os.walk(dir_path):  # Recursively walks all subdirs
        for file in files:
            if file.lower().endswith(('.doc', '.docx')) and not file.startswith('~$'):  # skip temp Word files
                input_file = os.path.join(root, file)
                output_file = os.path.splitext(input_file)[0] + ".pdf"
                convert_to_pdf(input_file, output_file)

def process_single_file(input_file, output_file=None):
    if not output_file:
        output_file = os.path.splitext(input_file)[0] + ".pdf"
    convert_to_pdf(input_file, output_file)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python doc_to_pdf.py <input_path> [output_path]")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None

    if os.path.isdir(input_path):
        process_directory_recursively(input_path)
    elif os.path.isfile(input_path) and input_path.lower().endswith(('.doc', '.docx')):
        process_single_file(input_path, output_path)
    else:
        print("Invalid input. Provide a .doc/.docx file or a folder path.")
