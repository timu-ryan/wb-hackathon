import pandas as pd
from preprocessing import preprocess
from model_handler import predict_proba

# app = FastAPI()  ?

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))
        df_preprocessed = preprocess(df)
        predictions = predict_proba(df_preprocessed)
        return {"predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
