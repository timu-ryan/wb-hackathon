Hackathon Wildberries
=====================
описание...

Начало работы
-------------
### Клонирование репозитория
```bash
git clone git@github.com:timu-ryan/wb-hackathon.git
```
```bash
cd wb-hackathon
```

В результате появится папка ml и fraud_detection_api


## Запуск проекта с Docker
убедитесь, что порты :3000 и :8000 свободны
запустите проект командой
```bash
sudo docker-compose up -d
```

Откройте в браузере:
Фронтенд: http://localhost:3000

Бэкенд (документация API): http://localhost:8000/docs


Чтобы остановить проект:
```bash
sudo docker-compose down
```



Установка зависимостей API
--------------------------------
1. Перейдите в директорию проекта:
```bash
cd fraud_detection_api
```

2. Создайте виртуальное окружение:
```bash
python3 -m venv api_venv
```

3. Активируйте виртуальное окружение:
- Linux/macOS: 
```bash
source api_venv/bin/activate
```
- Windows:
```bash 
.\api_venv\Scripts\Activate.ps1
```

4. Установите зависимости:
```bash
pip install -r requirements.txt
```

5. Запустите проект (в dev режиме)
```bash
uvicorn app.main:app --reload
```


## Примеры запросов к API

### 1. Эндпоинт `/predict` (одиночный запрос)

```bash
curl -X 'POST' \
  'http://localhost:8000/predict' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": 35434,
    "nm_id": 37225,
    "created_date": "2025-03-02 16:13:47+03:00",
    "service": "nnsz",
    "total_ordered": 854,
    "payment_type": "CSH",
    "is_paid": false,
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
  }'
```

### 2. Эндпоинт /predict_batch (пакетный запрос)

```bash
curl -X 'POST' \
  'http://localhost:8000/predict_batch' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '[
    {
      "user_id": 35434,
      "nm_id": 37225,
      "created_date": "2025-03-02 16:13:47+03:00",
      "service": "nnsz",
      "total_ordered": 854,
      "payment_type": "CSH",
      "is_paid": false,
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
    },
    {
      "user_id": 35435,
      "nm_id": 37226,
      "created_date": "2025-03-03 10:20:30+03:00",
      "service": "center",
      "total_ordered": 100,
      "payment_type": "CRD",
      "is_paid": true,
      "count_items": 2,
      "unique_items": 1,
      "avg_unique_purchase": 0.5,
      "is_courier": 1,
      "nm_age": 60,
      "distance": 500,
      "days_after_registration": 200,
      "number_of_orders": 5,
      "number_of_ordered_items": 200,
      "mean_number_of_ordered_items": 40.0,
      "min_number_of_ordered_items": 10,
      "max_number_of_ordered_items": 100,
      "mean_percent_of_ordered_items": 50.0
    }
  ]'
```

### Формат ответа:

Для обоих эндпоинтов ответ будет в формате:

```bash
{
  "prediction": 0,
  "confidence": 0.23,
  "is_fraud": false
}
```
(Для /predict_batch - массив таких объектов)


Установка зависимостей ML
--------------------------------
1. Перейдите в директорию проекта:
```bash
cd ml
```

2. Создайте виртуальное окружение:
```bash
python3 -m venv venv
```

3. Активируйте виртуальное окружение:
- Linux/macOS: 
```bash
source venv/bin/activate
```
- Windows:
```bash 
.\venv\Scripts\Activate.ps1
```

4. Установите зависимости:
```bash
pip install -r requirements.txt
```

Обновление зависимостей
----------------------
После установки новых библиотек:
```bash
pip freeze > requirements.txt
```

tbc...

