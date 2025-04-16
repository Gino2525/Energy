from pycaret.regression import *
import pandas as pd

# Dummy DataFrame for training
data = pd.DataFrame({
    "feature1": [1, 2, 3, 4, 5],
    "feature2": [2, 3, 4, 5, 6],
    "feature3": [3, 4, 5, 6, 7],
    "target": [10, 15, 20, 25, 30]
})

# Set up PyCaret model with reduced folds
exp = setup(data, target="target", session_id=123, fold=2)

# Train model
model = create_model("lr")  # Linear Regression

# Save the model
save_model(model, "energy_model")

print("✅ Model saved successfully as 'energy_model.pkl'")
