import re

# Open the file in binary mode to avoid encoding issues
csv_path = r'backend\productionData\finalOddSemData\yehLe.csv'

# Define a regular expression to find special characters
# This will match any character that is not alphanumeric, a space, or one of the allowed symbols (-, [, ], ", @, .)
allowed_special_chars = re.compile(r'[^a-zA-Z0-9\s\-\(\)\/\[\]\"@.,]')

with open(csv_path, 'rb') as file:
    try:
        # Read the file line by line
        count = 0
        for i, line in enumerate(file):
            try:
                # Decode the line from bytes to string (UTF-8) and strip any trailing newline characters
                decoded_line = line.decode('utf-8').strip()

                # Check for special characters not in the allowed list
                special_chars = allowed_special_chars.findall(decoded_line)

                if special_chars:
                    print(f"Special characters found in line {i + 1}: {special_chars}")
                    count += 1

            except UnicodeDecodeError as e:
                # If decoding fails, print the line number and byte position
                print(f"Decoding error at line {i + 1}, byte position {e.start}: {e}")
                break
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("line with sp chars: ", count)
        print("done")
