import pandas as pd
from datetime import datetime

def prepare_features(input_data: dict) -> pd.DataFrame:
    """Подготавливает все необходимые признаки для модели"""
    # Базовые признаки
    features = {
        'user_id': input_data['user_id'],
        'nm_id': input_data['nm_id'],
        'total_ordered': input_data['total_ordered'],
        'count_items': input_data['count_items'],
        'unique_items': input_data['unique_items'],
        'avg_unique_purchase': input_data['avg_unique_purchase'],
        'nm_age': input_data['NmAge'],
        'distance': input_data['Distance'],
        'days_after_registration': input_data['DaysAfterRegistration'],
        'number_of_orders': input_data['number_of_orders'],
        'number_of_ordered_items': input_data['number_of_ordered_items'],
        'mean_number_of_ordered_items': input_data['mean_number_of_ordered_items'],
        'min_number_of_ordered_items': input_data['min_number_of_ordered_items'],
        'max_number_of_ordered_items': input_data['max_number_of_ordered_items'],
        'mean_percent_of_ordered_items': input_data['mean_percent_of_ordered_items'],
    }
    
    # Извлекаем день и час из даты
    created_date = pd.to_datetime(input_data['CreatedDate'])
    features['day'] = created_date.day
    features['hour'] = created_date.hour
    
    # One-hot encoding для категориальных признаков
    payment_type = input_data.get('PaymentType', 'CSH')
    features.update({
        f'payment_type_{payment_type}': 1,
        'payment_type_other': 0 if payment_type in ['CSH', 'CRD', 'BAL'] else 1,
        'is_paid_True': int(input_data['IsPaid']),
        'is_paid_False': int(not input_data['IsPaid']),
        'service_nnsz': int(input_data['service'] == 'nnsz'),
        'service_other': int(input_data['service'] != 'nnsz'),
        'is_courier_1': int(input_data['is_courier'] == 1),
        'is_courier_0': int(input_data['is_courier'] == 0)
    })
    
    return pd.DataFrame([features])

def get_expected_features() -> list:
    """Возвращает полный список признаков, которые ожидает модель"""
    return [
        'user_id', 'nm_id', 'total_ordered', 'count_items', 'unique_items',
        'avg_unique_purchase', 'nm_age', 'distance', 'days_after_registration',
        'number_of_orders', 'number_of_ordered_items', 'mean_number_of_ordered_items',
        'min_number_of_ordered_items', 'max_number_of_ordered_items',
        'mean_percent_of_ordered_items', 'day', 'hour',
        'payment_type_CSH', 'payment_type_CRD', 'payment_type_BAL', 'payment_type_other',
        'is_paid_True', 'is_paid_False',
        'service_nnsz', 'service_other',
        'is_courier_1', 'is_courier_0'
    ]