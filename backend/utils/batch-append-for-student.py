import pandas as pd

# Load the CSV file
csv_path = r'working_data\stuData.csv'
df = pd.read_csv(csv_path)

# Fill NaN values with empty strings to avoid assignment issues
df = df.fillna(' ')

# Sort the DataFrame by course, semester, and seat number
df = df.sort_values(by=['course', 'semester', 'seatNumber'])

# Initialize lists to store consistent and inconsistent data
inconsistent_data = []
data_arrays_check = []

# Process each row to check for inconsistencies and assign batches
grouped = df.groupby(['course', 'semester'])

def assign_batches(group, batch_size):
    group_size = len(group)
    num_batches = (group_size + batch_size - 1) // batch_size  # Calculate the number of batches
    batch_sizes = [group_size // num_batches + (1 if i < group_size % num_batches else 0) for i in range(num_batches)]
    
    batches = []
    batch_index = 0
    for size in batch_sizes:
        for _ in range(size):
            batches.append(batch_index + 1)
        batch_index += 1
    
    return batches

for (course, semester), group in grouped:
    consistent_data = []
    group_size = len(group)
    
    # Create batch assignments for Practical and Theory/Tutorial
    practical_batches = assign_batches(group, 60)
    theory_batches = assign_batches(group, 145)
    
    # Assign batches for each student in the group
    for idx, row in enumerate(group.itertuples(index=False)):
        subjects = [subj.strip() for subj in row.subjects.split(',')]
        subject_types = [subj_type.strip() for subj_type in row.subjectType.split(',')]
        
        if len(subjects) == len(subject_types):
            batches = []
            for subj_type in subject_types:
                if subj_type == 'Practical':
                    batch = practical_batches[idx]
                else:  # Theory or Tutorial
                    batch = theory_batches[idx]
                batches.append(batch)
            
            record = {
                "email": row.email,
                "firstName": row.firstName,
                "middleName": row.middleName,
                "lastName": row.lastName,
                "semester": int(row.semester),
                "subjects": subjects,
                "subjectType": subject_types,
                "course": row.course,
                "seatNumber": row.seatNumber,
                "batch": batches
            }
            consistent_data.append(record)
        else:
            # If data is inconsistent, store in inconsistent_data and data_arrays_check
            inconsistent_data.append({
                "email": row.email,
                "lastName": row.lastName,
                "firstName": row.firstName,
                "middleName": row.middleName,
                "semester": int(row.semester),
                "subjects": subjects,
                "subjectType": subject_types,
                "course": row.course,
                "seatNumber": row.seatNumber,
                "batch": row.get('batch', [1] * len(subjects))  # Handle missing 'batch' column gracefully
            })
            data_arrays_check.append({
                "email": row.email,
                "lastName": row.lastName,
                "firstName": row.firstName,
                "middleName": row.middleName,
                "semester": int(row.semester),
                "subjects": row.subjects,
                "subjectType": row.subjectType,
                "course": row.course,
                "seatNumber": row.seatNumber
            })
    consistent_df = pd.DataFrame(consistent_data)
    output_consistent_path = rf"backend\productionData\oddSemFinalData\{course} Sem{semester}.csv"
    consistent_df = consistent_df.applymap(lambda x: str(x).replace("'", ""))
    consistent_df.to_csv(output_consistent_path, index=False)
    print(rf"{course}'s sem {semester} csv stored at {output_consistent_path}")


inconsistent_df = pd.DataFrame(inconsistent_data)
data_arrays_check_df = pd.DataFrame(data_arrays_check)

# Save inconsistent data to CSV
output_inconsistent_path = r"inconsitent.csv"
if (inconsistent_df.empty!= True):inconsistent_df.to_csv(output_inconsistent_path, index=False)

# Save dataArraysCheck data to CSV
output_data_arrays_check_path = r"arrayIssue.csv"
if (data_arrays_check_df.empty != True): data_arrays_check_df.to_csv(output_data_arrays_check_path, index=False)

print("Data has been processed and written to the respective CSV files.")
