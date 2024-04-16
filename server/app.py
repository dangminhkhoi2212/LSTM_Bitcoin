from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from keras.models import load_model
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from util.help import predict_future, MAX_DATE, transform, inverse_transform
app = Flask(__name__)
CORS(app)


@app.route("/")
def Home():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        form = request.json['data']
        num_date = request.json['numDate']

        features = np.array(form)
        features = transform(features)
        prediction = predict_future(features, num_date=num_date)
        print(f"🚀 ~ form: {prediction}")
        prediction = prediction.flatten()
        prediction = inverse_transform(prediction)
        prediction = np.round(prediction, decimals=3)
        prediction = prediction.tolist()

        return jsonify(prediction)
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
