import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

file_path = "students.csv"
df = pd.read_csv(file_path)
df = df.drop('Name', axis=1)
df['Emotional_Behavior'] = df['Emotional_Behavior'].map({'Poor': 0, 'Fair': 1, 'Good': 2, 'Excellent': 3})
df['Dropped_Out'] = df['Dropped_Out'].map({'No': 0, 'Yes': 1})
X = df.drop('Dropped_Out', axis=1)
y = df['Dropped_Out']

scaler = StandardScaler()
X = scaler.fit_transform(X)

model = LogisticRegression()
model.fit(X, y)

print("Enter the student's information:")
gpa = float(input("GPA (0-4 scale): "))
tardies = int(input("Number of Tardies: "))
absences = int(input("Number of Absences: "))
emotional_behavior = input("Emotional Behavior (Poor/Fair/Good/Excellent): ")

emotional_behavior_mapping = {'Poor': 0, 'Fair': 1, 'Good': 2, 'Excellent': 3}
emotional_behavior_numeric = emotional_behavior_mapping.get(emotional_behavior, -1)

user_data = [[gpa, tardies, absences, emotional_behavior_numeric]]
user_data_scaled = scaler.transform(user_data)
prediction = model.predict(user_data_scaled)

if prediction[0] == 0:
    print("The model predicts that the student will not drop out.")
else:
    print("The model predicts that the student will drop out.")
