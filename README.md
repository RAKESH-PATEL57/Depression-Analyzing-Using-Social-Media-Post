[React Frontend] → [Node/Express API] → [Twitter API]
                                     ↓
[React Frontend] ← [Node/Express API] ← [Python ML API]


1. React handles UI/UX
2. Node handles Twitter API integration and basic sentiment analysis
3. Python handles the ML model training and inference

depression-analysis-project/
│
├── node-backend/        # Express server handling Twitter API
├── python-ml/           # ML model code for depression detection
└── react-frontend/      # React user interface



# 1. Setup Node backend
cd node-backend
npm install
# Create .env file with TWITTER_BEARER_TOKEN=your_token_here

# 2. Setup Python ML service
cd ../python-ml
pip install -r requirements.txt

# 3. Setup React frontend
cd ../react-frontend
npm install


# Terminal 1 - Node backend
cd node-backend
npm run dev

# Terminal 2 - Python ML service
cd python-ml
python api.py

# Terminal 3 - React frontend
cd react-frontend
npm run dev

# First, acquire a depression dataset (from Kaggle)
# Place it in python-ml/data/depression_dataset.csv
cd python-ml
python train_model.py

1 -> depressed
0 -> non depressed