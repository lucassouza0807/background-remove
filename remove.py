import sys
import base64
from rembg import remove

def remove_background(input_data):
    input_bytes = base64.b64decode(input_data)
    output_bytes = remove(input_bytes)
    output_data = base64.b64encode(output_bytes).decode('utf-8')
    return output_data

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py input_file_path")
        sys.exit(1)

    input_file_path = sys.argv[1]

    try:
        # Read base64 input from the specified file
        with open(input_file_path, 'r') as file:
            base64_input = file.read().strip()
    except Exception as e:
        print(f"Error reading file: {str(e)}")
        sys.exit(1)

    output_base64 = remove_background(base64_input)

    print(output_base64)
