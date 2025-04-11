# 🌾 Smart Agriculture Supply Chain Management System

A full-stack web application that aims to revolutionize traditional agriculture by leveraging AI, Machine Learning, and Blockchain simulation to optimize the supply chain. This system supports crop yield prediction, disease detection via image classification, transparent contract management using smart contract logic, and secure data storage with MongoDB.

---

## 🚀 Features

- **Crop Prediction:**  
  AI model to predict the best crop based on soil, weather, and region data.

- **Plant Disease Detection:**  
  Upload plant leaf images (Tomato, Pepper, Potato) to detect diseases using a trained deep learning model.

- **Smart Contracts (Simulated Blockchain):**  
  Create and manage buyer-farmer contracts transparently.

- **Profile & Dashboard:**  
  Users can view predictions, contract history, and manage their profile.

- **MongoDB Integration:**  
  All user data, prediction results, contracts, and uploaded images are stored persistently.

---

## 🧑‍💻 Tech Stack

### 🔹 Frontend
- Next.js (App Router)
- Tailwind CSS
- ShadCN UI
- React Hook Form

### 🔹 Backend
- FastAPI
- Python (AI/ML Models)
- Pydantic Schemas

### 🔹 Database
- MongoDB

### 🔹 AI/ML
- Scikit-Learn (Crop Prediction)
- TensorFlow / Keras (Disease Detection)
- Trained CNN for image classification

---

## 🗂️ Folder Structure (Simplified)

project-root/ │ ├── backend/ │ ├── app/ │ │ ├── routes/ │ │ ├── models/ │ │ ├── schema/ │ │ ├── database.py │ │ └── main.py │ └── disease_model/ │ └── trained_model.h5 │ ├── frontend/ │ └── app/ │ ├── dashboard/ │ ├── contracts/ │ ├── profile/ │ └── crop-prediction/ │ ├── blockchain/ │ ├── contract.sol │ └── interact.js


## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/agriculture-supply-chain.git
cd agriculture-supply-chain


#Backend Setup (FastAPI + AI Models)

cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload


Ensure your .env file contains:
MONGO_URI = "your_mongo_uri"
UPLOAD_DIR = "./uploads"


#Frontend Setup (Next.js)

cd frontend
npm install
npm run dev


How to Re-run Project (If APIs and Environment Are Closed)
If you've previously shut down all servers and environments, follow these steps to restart everything locally:

Ensure prerequisites are installed:

Python 3.9+

Node.js 18+

MongoDB (local or Atlas)

Start the backend:

bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
Start the frontend:

bash
Copy
Edit
cd frontend
npm install
npm run dev
Open your browser and go to:

arduino
Copy
Edit
http://localhost:3000
(Optional) If models (.h5, .pkl) are missing, retrain them or download them again.

### References

-FastAPI Documentation
-Next.js Documentation
-MongoDB
-Scikit-Learn
-TensorFlow/Keras
-Shadcn UI

### Acknowledgements
-Thanks to all open-source contributors and the agriculture datasets available through Kaggle and public research initiatives.

###📩 Contact
-Feel free to connect for collaboration, improvements, or queries:

-Email: jagmohanprajapat003@gmail.com

-LinkedIn: https://www.linkedin.com/in/jagmohan-prajapati-aaa117200/
