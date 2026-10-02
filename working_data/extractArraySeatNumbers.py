import pandas as pd

# Load the Excel file
file_path = r'backend\productionData\finalOddSemData\yehLe.csv'  # Update this with your file path

# Read the Excel file into a DataFrame
df = pd.read_csv(file_path)

# Specify the column name or index that contains the 11-digit integers
column_name = 'seatNumber'  # Update this with your actual column name

# Extract 11-digit integers
def extract_11_digit_integers(column):
    # Filter the column for 11-digit integers
    return [int(val) for val in column if pd.notnull(val) and isinstance(val, (int, float)) and len(str(int(val))) == 11]

# Get the column data
column_data = df[column_name]

# Extract the integers
array_of_11_digit_integers = extract_11_digit_integers(column_data)

print(array_of_11_digit_integers)
