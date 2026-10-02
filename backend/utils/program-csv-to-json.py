import csv
import json
from collections import defaultdict

# Initialize a defaultdict to store the data
data = defaultdict(lambda: defaultdict(list))

# Read the CSV file
with open(r'backend\productionData\finalOddSemData\programData.csv', mode='r') as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        course_name = row['courseName']
        semester = row['semester']
        subject = row['subjects']
        
        # Add the subject to the corresponding course and semester
        data[course_name][semester].append(subject)

# Convert the defaultdict to a list of JSON objects
result = []
for course_name, semesters in data.items():
    for semester, subjects in semesters.items():
        result.append({
            "courseName": course_name,
            "semester": semester,
            "subjects": subjects
        })

# Write the JSON output to a file
with open(r'backend\productionData\finalOddSemData\programData.json', mode='w') as json_file:
    json.dump(result, json_file, indent=4)

print("CSV data has been successfully converted to JSON and saved to 'programData.json'.")
