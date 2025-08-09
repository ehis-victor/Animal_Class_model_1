# 🐾 Animal Classification Web App

A simple **Animal Classification Web Application** built with **TensorFlow Lite** and **Flask**.  
Upload an image, and the app will instantly predict the type of animal using a pre-trained `.tflite` model.

🔗 **Live Demo:** [https://animal-class-model-1-1.onrender.com/](https://animal-class-model-1-1.onrender.com/)

---

## 🖼 Overview
![App Screenshot](<img width="1895" height="966" alt="Screenshot 2025-08-09 011857" src="https://github.com/user-attachments/assets/5ef6f2f0-b096-44e3-97a0-2f56a202d2d7" />
)  

---

## 🚀 How It Works
1. **User uploads an image** through the web interface.  
2. **Backend (Flask)** processes the image and runs it through a **TensorFlow Lite** model.  
3. **Prediction results** are displayed instantly in the browser.

---

## 🔧 Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python (Flask)  
- **ML Model:** TensorFlow Lite (`.tflite`)  
- **Hosting:** Render / Docker  

---

## 📦 Run Locally
```bash
# Clone repo
git clone https://github.com/ehis-victor/Animal_Class_Model.git
cd Animal_Class_Model

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Start app
python app.py
