from catboost import CatBoostClassifier
import pandas as pd

model = CatBoostClassifier()
model.load_model("ml/best_model.cbm")
print(model)

def predict_proba(df: pd.DataFrame):
    proba = model.predict_proba(df)
    return proba.tolist()
