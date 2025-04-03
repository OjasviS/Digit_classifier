import tensorflow as tf
from flask import Flask, render_template, request, jsonify
import numpy as np

model = tf.keras.models.load_model("C:\\CS\\workspace\\digit_classifier_final_folder\\static\\models\\hand_written_digit_classifier.h5")

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('grid.html')

@app.route("/predict", methods = ['POST'])
def predict():
    try:
        rawData = request.json['data']
        
        data = np.array(rawData)
        print(data)
        data = data.reshape(1, 784)
        prediction = model.predict(data)
        res = int(np.argmax(prediction))
        return jsonify({'prediction':res})
    except Exception as e:
        return jsonify({"error": str(e)})
if __name__ == '__main__':
    app.run(debug = True)