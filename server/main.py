from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from keras.models import load_model
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from util.help import predict_future, MAX_DATE

app = Flask(__name__)
CORS(app)


@app.route("/")
def Home():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        scaler = MinMaxScaler()
        form = request.json['data']
        num_date = request.json['numDate']

        features = np.array(form).reshape((1, MAX_DATE, 1))
        features = scaler.fit_transform(features.reshape(-1, 1))
        prediction = predict_future(features, num_date=num_date)
        # print(f"🚀 ~ form: {prediction}",file=sys.stderr )
        prediction = scaler.inverse_transform(prediction)
        prediction = prediction.flatten()
        prediction = [round(val, 3) for val in prediction]
        # prediction = prediction.tolist()
        return jsonify(prediction)
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
