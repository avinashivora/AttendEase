import csv
import json

def read_csv_file(csv_file_path):
    """Reads a CSV file and returns a set of tuples from three columns."""
    data_set = []
    with open(csv_file_path, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            # Adjust column names based on your CSV file
            column1 = row['courseName']
            column2 = int(row['semester'])
            column3 = row['subjects']
            data_set.append((column1, column2, column3))
    return data_set

def read_json_file(json_file_path):
    """Reads a JSON file and returns a list of tuples based on three fields."""
    with open(json_file_path, mode='r') as json_file:
        json_data = json.load(json_file)
        
        # Adjust these field names based on your JSON file structure
        json_values = [(selectQuery['course'], selectQuery['semester'], selectQuery['subjects']) for item in json_data for selectQuery in item['selectQuery']]
        return json_values

def compare_data(csv_data, json_data):
    """Compares data between CSV and JSON, and returns items in JSON that are not in CSV."""
    not_in_csv = [item for item in json_data if item not in csv_data]
    return not_in_csv

def main(csv_file_path, json_file_path):
    # Read data from CSV
    csv_data = read_csv_file(csv_file_path)
    
    # Read data from JSON
    json_data = read_json_file(json_file_path)
    
    # Compare data and get items in JSON that are not present in CSV
    not_in_csv = compare_data(csv_data, json_data)
    
    # Display results
    if not_in_csv:
        print(f"Records in JSON that are not in CSV({len(not_in_csv)}):")
        for item in not_in_csv:
            print(item)
    else:
        print("All records in JSON are present in CSV.")

if __name__ == '__main__':
    # Paths to your files
    csv_file_path = r'backend\productionData\finalOddSemData\programData.csv'
    json_file_path = r'backend\productionData\finalOddSemData\facultyData.json'
    
    # Execute the main function
    main(csv_file_path, json_file_path)
