from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import os
import base64

app = Flask(__name__)

# Load TFLite model
model_path = os.path.join("model", "best_model_quantized.tflite")
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Load class labels automatically
labels_path = os.path.join("model", "class_labels.json")
with open(labels_path, "r") as f:
    class_labels = json.load(f)


def preprocess_image(image):
    img = image.convert('RGB').resize((224, 224))
    img_array = np.array(img).astype(np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if 'images[]' not in request.files:
        return jsonify({'error': 'No images provided'}), 400

    files = request.files.getlist('images[]')
    results = []

    for file in files:
        file.seek(0)
        try:
            img_bytes = file.read()
            img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        except Exception as e:
            results.append({
                'filename': file.filename,
                'error': f"Failed to open image: {str(e)}"
            })
            continue
        input_data = preprocess_image(img)

        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        prediction = interpreter.get_tensor(output_details[0]['index'])

        predicted_class = int(np.argmax(prediction))
        confidence = float(np.max(prediction) * 100)

        # Encode image to base64 for preview
        buffered = io.BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        results.append({
            'filename': file.filename,
            'class': class_labels[predicted_class],
            'confidence': f"{confidence:.2f}%",
            'image': img_str
        })

    return jsonify(results)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
