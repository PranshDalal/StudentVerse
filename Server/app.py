from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import numpy as np

app = Flask(__name__)
CORS(app)

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

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    emotional_behavior_mapping = {'Poor': 0, 'Fair': 1, 'Good': 2, 'Excellent': 3}
    emotional_behavior_numeric = emotional_behavior_mapping.get(data['emotionalBehavior'], -1)

    user_data = [[data['gpa'], data['tardies'], data['absences'], emotional_behavior_numeric]]
    user_data_scaled = scaler.transform(user_data)
    prediction = model.predict(user_data_scaled)

    prediction_list = prediction.tolist()

    if int(prediction_list[0]) == 1:
        prediction_final = "The student will most likely drop out"
    else:
        prediction_final = "The student will most likely not drop out"

    return jsonify({'prediction': prediction_final})

if __name__ == '__main__':
    app.run(debug=True)
