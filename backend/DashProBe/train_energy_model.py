import pandas as pd
import joblib
import xgboost as xgb

# Load and preprocess your data
df = pd.read_csv('your_energy_data.csv')
df['ds'] = pd.to_datetime(df['ds'])
df = df.sort_values('ds')
df.set_index('ds', inplace=True)

# Feature engineering
df['dayofweek'] = df.index.dayofweek
df['month'] = df.index.month
df['day'] = df.index.day

X = df[['dayofweek', 'month', 'day']]
y = df['y']

# Train the model
model = xgb.XGBRegressor()
model.fit(X, y)

# Save the model
joblib.dump(model, 'energy_model_xgb.pkl')
print("✅ XGBoost model saved!")
