from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import os
from typing import List
import logging
from datetime import datetime
from catboost import CatBoostClassifier
from pydantic import BaseModel
from typing import Optional

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Конфигурация
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Загрузка предобработчиков и модели
scaler = joblib.load(os.path.join(CURRENT_DIR, 'preprocessing', 'scaler.pkl'))
encoder = joblib.load(os.path.join(CURRENT_DIR, 'preprocessing', 'encoder.pkl'))
model = CatBoostClassifier()
model.load_model(os.path.join(CURRENT_DIR, 'models', 'best_model.cbm'))

# Определение колонок
NUMERICAL_COLUMNS = [
    'total_ordered', 'count_items', 'unique_items', 'avg_unique_purchase', 
    'nm_age', 'distance', 'days_after_registration', 'number_of_orders',
    'number_of_ordered_items', 'mean_number_of_ordered_items',
    'min_number_of_ordered_items', 'max_number_of_ordered_items',
    'mean_percent_of_ordered_items'
]

CATEGORICAL_COLUMNS = ["is_paid", "is_courier", "service", "payment_type"]

class OrderFeatures(BaseModel):
    user_id: int
    nm_id: int
    created_date: str
    service: str
    total_ordered: int
    payment_type: str
    is_paid: bool
    count_items: int
    unique_items: int
    avg_unique_purchase: float
    is_courier: int
    nm_age: int
    distance: int
    days_after_registration: int
    number_of_orders: int
    number_of_ordered_items: int
    mean_number_of_ordered_items: float
    min_number_of_ordered_items: int
    max_number_of_ordered_items: int
    mean_percent_of_ordered_items: float

    class Config:
        schema_extra = {
            "example": {
                "user_id": 35434,
                "nm_id": 37225,
                "created_date": "2025-03-02 16:13:47+03:00",
                "service": "nnsz",
                "total_ordered": 854,
                "payment_type": "CSH",
                "is_paid": False,
                "count_items": 0,
                "unique_items": 0,
                "avg_unique_purchase": 0.0,
                "is_courier": 0,
                "nm_age": 114,
                "distance": 913,
                "days_after_registration": 1078,
                "number_of_orders": 1,
                "number_of_ordered_items": 854,
                "mean_number_of_ordered_items": 854.0,
                "min_number_of_ordered_items": 854,
                "max_number_of_ordered_items": 854,
                "mean_percent_of_ordered_items": 100.0
            }
        }

class PredictionResult(BaseModel):
    prediction: int
    confidence: float
    is_fraud: bool

app = FastAPI(
    title="Fraud Order Detection API",
    description="API for detecting fraudulent orders aimed at stock blocking",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для разработки
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    # Преобразование даты
    df['created_date'] = pd.to_datetime(df['created_date'])
    df['day'] = df['created_date'].dt.day
    df['hour'] = df['created_date'].dt.hour
    df['weekday'] = df['created_date'].dt.weekday
    
    # Масштабирование числовых признаков
    num_scaled = scaler.transform(df[NUMERICAL_COLUMNS])
    num_df = pd.DataFrame(num_scaled, columns=NUMERICAL_COLUMNS)
    
    # Кодирование категориальных признаков
    cat_encoded = encoder.transform(df[CATEGORICAL_COLUMNS])
    cat_df = pd.DataFrame(cat_encoded, 
                         columns=encoder.get_feature_names_out(CATEGORICAL_COLUMNS))
    
    # Объединение всех признаков
    processed_df = pd.concat([
        df[['day', 'hour', 'weekday']],
        num_df,
        cat_df
    ], axis=1)
    
    return processed_df

@app.post("/predict", response_model=PredictionResult)
async def predict(order: OrderFeatures):
    try:
        # Конвертируем входные данные в DataFrame
        input_data = order.dict()
        df = pd.DataFrame([input_data])
        
        # Предобработка
        processed_df = preprocess_data(df)
        
        # Предсказание
        proba = model.predict_proba(processed_df)[0]
        prediction = int(proba[1] > 0.5)  # Порог можно настроить
        
        return {
            "prediction": prediction,
            "confidence": float(proba[1]),
            "is_fraud": bool(prediction)
        }
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict_batch", response_model=List[PredictionResult])
async def predict_batch(orders: List[OrderFeatures]):
    try:
        # Конвертируем список заказов в DataFrame
        input_data = [order.dict() for order in orders]
        df = pd.DataFrame(input_data)
        
        # Предобработка
        processed_df = preprocess_data(df)
        
        # Предсказания
        probabilities = model.predict_proba(processed_df)[:, 1]
        predictions = (probabilities > 0.5).astype(int)
        
        return [{
            "prediction": int(pred),
            "confidence": float(prob),
            "is_fraud": bool(pred)
        } for pred, prob in zip(predictions, probabilities)]
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

# @app.post("/predict_csv", response_model=List[PredictionResult])
# async def predict_csv(file: UploadFile = File(...)):
#     try:
#         # Чтение CSV
#         df = pd.read_csv(file.file)
        
#         # Предобработка
#         processed_df = preprocess_data(df)
        
#         # Предсказания
#         probabilities = model.predict_proba(processed_df)[:, 1]
#         predictions = (probabilities > 0.5).astype(int)
        
#         return [{
#             "prediction": int(pred),
#             "confidence": float(prob),
#             "is_fraud": bool(pred)
#         } for pred, prob in zip(predictions, probabilities)]
#     except Exception as e:
#         logger.error(f"CSV processing error: {str(e)}")
#         raise HTTPException(status_code=400, detail=str(e))
