from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class OrderFeatures(BaseModel):
    user_id: int = Field(..., example=35434)
    nm_id: int = Field(..., example=37225)
    CreatedDate: str = Field(..., example="2025-03-02 16:13:47+03:00")
    service: str = Field(..., example="nnsz")
    total_ordered: int = Field(..., example=854)
    PaymentType: str = Field(..., example="CSH")
    IsPaid: bool = Field(..., example=False)
    count_items: int = Field(..., example=0)
    unique_items: int = Field(..., example=0)
    avg_unique_purchase: float = Field(..., example=0.0)
    is_courier: int = Field(..., example=0)
    NmAge: int = Field(..., example=114)
    Distance: int = Field(..., example=913)
    DaysAfterRegistration: int = Field(..., example=1078)
    number_of_orders: int = Field(..., example=1)
    number_of_ordered_items: int = Field(..., example=854)
    mean_number_of_ordered_items: float = Field(..., example=854.0)
    min_number_of_ordered_items: int = Field(..., example=854)
    max_number_of_ordered_items: int = Field(..., example=854)
    mean_percent_of_ordered_items: float = Field(..., example=100.0)

class PredictionResult(BaseModel):
    prediction: int = Field(..., description="0 - нормальный заказ, 1 - фрод")
    confidence: float = Field(..., description="Вероятность фрода (0-1)")
    is_fraud: bool = Field(..., description="Фрод или нет")