import pandas as pd
from numpy import nan
import json

# Path to your CSV file
csv_file = r'working_data\facultyData.csv'

# Read CSV into pandas DataFrame
df = pd.read_csv(csv_file)
df = df.fillna(' ')

# Initialize result list for JSON output
result = []
teachers = {}

for _, row in df.iterrows():
    if row['email'] is not nan:
        teachers[row['email']] = {}

def entry(email,first_name,middle_name,last_name,isActive,visitingFaculty,semester,subject,subject_type,course,batch):
    global teachers

    select_entry = {
        "semester": semester,
        "subjects": subject,
        "subjectType": subject_type,
        "course": course,
        "batch": batch
    }

    if row['email'] is not nan:
        if teachers[row['email']] == {}:
            select_query = [select_entry]
            # Construct the record for each row
            record = {
                "email": email,
                "firstName": first_name,
                "middleName": middle_name,
                "lastName": last_name,
                "isActive": isActive,
                "visitingFaculty": visitingFaculty,
                "selectQuery": select_query
            }
            teachers[row['email']] = record
        else:
            teachers.get(row['email'])['selectQuery'].append(select_entry)

# Iterate over rows in DataFrame
for _, row in df.iterrows():
    # Extract individual fields
    email = row['email']
    first_name = row['firstName']
    middle_name = "" if row['middleName'] is nan else row['middleName']
    last_name = row['lastName']
    isActive = "true" if row['isActive'] else "false"
    visitingFaculty = "true" if row['visitingFaculty'] else "false"
    # Structure for selectQuery
    semester = int(row['semester'])
    subject = row['subjects'] # check field name in csv
    subject_type = row['subjectType']
    course = row['course']
    batch = row['batch']

    if subject_type == "Theory":
        entry(email,first_name,middle_name,last_name,isActive,visitingFaculty,semester,subject,subject_type,course,batch)
    else:
        for i in range(1, batch+1):
            entry(email,first_name,middle_name,last_name,isActive,visitingFaculty,semester,subject,subject_type,course,i)

for key in teachers.keys():
    result.append(teachers[key])

print(len(result)) # remove NaN from dictionary and len-1  before verifying count

# Output file path for JSON
output_json_file = r'working_data\facultyData.json'

# Write the result list to JSON file
with open(output_json_file, 'w') as json_file:
    json.dump(result, json_file, indent=4)

print(f"CSV file '{csv_file}' successfully converted to JSON file '{output_json_file}'.")