import os
import csv

def generate_flexible_csv(root_dir, output_csv):
    print(f"Looking in: {root_dir}")

    allowed_extensions = {"png", "jpg"}
    rows = []
    max_levels = 0

    # Walk through the directory tree
    for current_path, _, files in os.walk(root_dir):
        for f in files:
            extension = os.path.splitext(f)[1][1:].lower()  # lowercase without dot
            if extension in allowed_extensions:
                rel_path = os.path.relpath(current_path, root_dir)
                parts = rel_path.split(os.sep) if rel_path != '.' else []
                max_levels = max(max_levels, len(parts))
                rows.append((parts, f, extension))

    print(f"\nMax folder depth: {max_levels}")
    print(f"Filtered files found: {len(rows)}")

    if rows:
        headers = [f"Level {i+1}" for i in range(max_levels)] + ["File", "Extension"]

        with open(output_csv, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(headers)
            for parts, filename, extension in rows:
                levels = parts + [""] * (max_levels - len(parts))
                writer.writerow(levels + [filename, extension])

        print(f"\n✅ CSV written to: {output_csv}")
    else:
        print("\n⚠️ No matching files found under the given directory.")

# 🔁 Update the paths before running
generate_flexible_csv(
    r"C:\Users\ramki\Downloads\GME-20250403T050310Z-003",
    r"C:\Users\ramki\Downloads\GME-20250403T050310Z-003\AI_courses_Img.csv"
)
