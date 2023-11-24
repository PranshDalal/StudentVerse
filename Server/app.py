from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import json
import smtplib
from email.mime.text import MIMEText
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)

# Reading the CSV file and preparing data for student predictions
file_path_students = "students.csv"
df_students = pd.read_csv(file_path_students)
df_students = df_students.drop('Name', axis=1)
df_students['Emotional_Behavior'] = df_students['Emotional_Behavior'].map({'Poor': 0, 'Fair': 1, 'Good': 2, 'Excellent': 3})
df_students['Dropped_Out'] = df_students['Dropped_Out'].map({'No': 0, 'Yes': 1})
X_students = df_students.drop('Dropped_Out', axis=1)
y_students = df_students['Dropped_Out']

# Setting scaler and model for student predictions
scaler_students = StandardScaler()
X_students = scaler_students.fit_transform(X_students)

model_students = LogisticRegression()
model_students.fit(X_students, y_students)

# Reading the CSV file and preparing data for college predictions
file_path_college = 'college.csv'
df_college = pd.read_csv(file_path_college)

# Split the data into features (X) and target variable (y)
X_college = df_college.drop('College', axis=1)
y_college = df_college['College']

# Encoding
le_college = LabelEncoder()
y_encoded_college = le_college.fit_transform(y_college)

# Train a ForestClassifier for college predictions
model_college = RandomForestClassifier(random_state=42)
model_college.fit(X_college, y_encoded_college)

# Sending email function
def send_email(to, name, prediction, is_college=True):
    subject = 'Prediction Results'
    if is_college:
        body = f"Hello,\n\nYour recommended college is: {prediction}\n\nBest regards,\nStudentVerse"
    else:
        body = f"Hello,\n\nYour prediction result is: {prediction}\n\nBest regards,\nStudentVerse"

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'studentverse101@gmail.com'
    smtp_password = 'xsiy vewk vstb tljb'

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = smtp_username
    msg['To'] = to

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(smtp_username, [to], msg.as_string())

        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Setting each type of emotional behavior to a certain number for student predictions
    emotional_behavior_mapping = {'Poor': 0, 'Fair': 1, 'Good': 2, 'Excellent': 3}
    emotional_behavior_numeric = emotional_behavior_mapping.get(data['emotionalBehavior'], -1)

    user_data_students = {
        'name': data['name'],
        'email': data['email'],
        'gpa': float(data['gpa']),
        'tardies': int(data['tardies']),
        'absences': int(data['absences']),
        'emotional_behavior': emotional_behavior_numeric
    }

    # Scaling the data for student predictions
    user_data_scaled_students = scaler_students.transform(
        [[user_data_students['gpa'], user_data_students['tardies'], user_data_students['absences'], user_data_students['emotional_behavior']]])

    prediction_students = model_students.predict(user_data_scaled_students)

    prediction_list_students = prediction_students.tolist()

    # Setting final prediction for student
    prediction_final_students = "The student will most likely drop out" if int(prediction_list_students[0]) == 1 else "The student will most likely not drop out"

    # Sending email to user with prediction results for student
    send_email(user_data_students['email'], user_data_students['name'], prediction_final_students, is_college=False)

    with open('student_data.json', 'a') as json_file_students:
        data_to_save_students = {
            'name': user_data_students['name'],
            'gpa': user_data_students['gpa'],
            'tardies': user_data_students['tardies'],
            'absences': user_data_students['absences'],
            'emotional_behavior': user_data_students['emotional_behavior'],
            'prediction': int(prediction_list_students[0])
        }
        json.dump(data_to_save_students, json_file_students)
        json_file_students.write('\n')

    return jsonify({'prediction': prediction_final_students})

@app.route('/predict_college', methods=['POST'])
def predict_college():
    data = request.get_json()

    # Create a DataFrame for the new sample for college predictions
    new_data_college = pd.DataFrame({
        'GPA': [float(data['gpa'])],
        'SAT': [int(data['sat'])],
        'ACT': [int(data['act'])],
        'Extracurriculars': [int(data['extracurriculars'])],
    })

    # Make a recommendation for the new sample for college predictions
    predicted_class_encoded_college = model_college.predict(new_data_college)[0]

    # Decode the predicted class for college
    predicted_class_college = le_college.inverse_transform([predicted_class_encoded_college])[0]

    with open('student_data_college.json', 'a') as json_file_college:
        data_to_save_college = {
            'name': data['name'],
            'gpa': float(data['gpa']),
            'sat': int(data['sat']),
            'act': int(data['act']),
            'extracurriculars': int(data['extracurriculars']),
            'recommended_college': predicted_class_college,
        }
        json.dump(data_to_save_college, json_file_college)
        json_file_college.write('\n')

    # Sending email to user with prediction results for college
    send_email(data['email'], data['name'], predicted_class_college, is_college=True)

    return jsonify({'recommended_college': predicted_class_college})


#Route for viewing dropout data
@app.route('/view_previous_data', methods=['GET'])
def view_previous_data():
    previous_data_students = []
    with open('student_data.json', 'r') as json_file_students:
        for line_students in json_file_students:
            previous_data_students.append(json.loads(line_students))

    return jsonify(previous_data_students)

#Route for viewing college data
@app.route('/view_previous_data_college', methods=['GET'])
def view_previous_data_college():
    previous_data_college = []
    with open('student_data_college.json', 'r') as json_file_college:
        for line_college in json_file_college:
            previous_data_college.append(json.loads(line_college))

    return jsonify(previous_data_college)

if __name__ == '__main__':
    app.run(debug=True)
