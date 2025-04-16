from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.decorators import api_view
import pandas as pd
from pycaret.regression import predict_model,load_model
from pycaret.regression import load_model
from .models import Cluster, EnergyPrediction,MachineData
from .serializers import ClusterSerializer, EnergyInputSerializer
import json
from django.http import JsonResponse
from .mqtt_service import get_latest_mqtt_data
from prophet import Prophet
import os
from django.conf import settings
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from datetime import timedelta
import joblib
from datetime import datetime
from .serializers import MachineDataSerializer
from datetime import datetime, time
from django.utils.timezone import make_aware
import csv
import io
from django.core.mail import EmailMessage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MachineData



class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return Response({
            "access": response.data['access'],
            "message": "Login successful",
        })

class LoggedInView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        return Response({"message": "Hello, you are logged in!"})


class ClusterViewSet(viewsets.ModelViewSet):
    queryset = Cluster.objects.all()
    serializer_class = ClusterSerializer

    def list(self, request):
        clusters = self.get_queryset()
        serializer = self.get_serializer(clusters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = ClusterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Cluster Created Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"status": status.HTTP_400_BAD_REQUEST, "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):  # ✅ Corrected method name
        try:
            cluster = Cluster.objects.get(pk=pk)
        except Cluster.DoesNotExist:
            return Response({"error": "Cluster not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(cluster, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Cluster Updated Successfully"}, status=status.HTTP_200_OK)
        return Response({"status": status.HTTP_400_BAD_REQUEST, "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



class PredictEnergyView(APIView):
    def post(self, request):
        try:
            data = request.data  # Django Rest Framework automatically parses JSON
            df = pd.DataFrame([{
                "feature1": data["current"],
                "feature2": data["power"],
                "feature3": data["temperature"]
            }])

            # Predict using PyCaret
            predictions = predict_model(model, data=df)

            # Extract the predicted value
            predicted_value = predictions.iloc[:, -1].values[0]

            # Define the voltage classification threshold
            voltage_threshold = 220  # Adjust this based on your requirement

            # Determine if it's High Voltage or Low Voltage
            voltage_category = "High Voltage" if predicted_value > voltage_threshold else "Low Voltage"

            return Response({
                "predicted_value": predicted_value,
                "voltage_category": voltage_category
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
           
class MachineDataListView(APIView):
    def get(self, request):
        machine_data = MachineData.objects.all().order_by('-timestamp')[:50]
        data = [
            {
                "machine_id": entry.machine.id if entry.machine else "unknown",
                "timestamp": entry.timestamp,
                "temperature": entry.temperature,
                "voltage": entry.voltage,
                "current": entry.current,
                "power": entry.power,
                "energy": entry.energy if hasattr(entry, "energy") else None,
            }
            for entry in machine_data
        ]
        return Response(data, status=status.HTTP_200_OK)

    


BASE_DIR = settings.BASE_DIR

class EnergyForecastingView(APIView):
    def get(self, request):
        try:
            # ✅ Load the XGBoost model
            model_path = os.path.join(BASE_DIR, 'energy_model_xgb.pkl')
            model = joblib.load(model_path)

            # ✅ Load the actual CSV data (replace with your real filename)
            csv_path = os.path.join(BASE_DIR, 'your_energy_data.csv')
            df = pd.read_csv(csv_path)
            df['ds'] = pd.to_datetime(df['ds'])
            df = df.sort_values('ds')
            df.set_index('ds', inplace=True)

            # Generate future dates
            start_date = datetime.today()
            future_dates = [start_date + timedelta(days=i) for i in range(1, 8)]

            # Create feature dataframe for prediction
            future_df = pd.DataFrame(index=future_dates)
            future_df['dayofweek'] = future_df.index.dayofweek
            future_df['month'] = future_df.index.month
            future_df['day'] = future_df.index.day

            # Predict
            future_preds = model.predict(future_df)

            # Format results
            forecast_data = [
                {"ds": date.strftime('%Y-%m-%d'), "yhat": float(pred)}
                for date, pred in zip(future_df.index, future_preds)
            ]

            return Response(forecast_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
def cluster_usage_view(request):
    df = pd.read_csv("your_energy_data.csv")
    df['ds'] = pd.to_datetime(df['ds'])

    # ✅ Filter to include only records up to today's date
    today = datetime.today().date()
    df = df[df['ds'].dt.date <= today]

    usage_values = df[['y']].copy()

    # Scaling and Clustering
    scaler = StandardScaler()
    scaled_usage = scaler.fit_transform(usage_values)

    kmeans = KMeans(n_clusters=3, random_state=42)
    df['cluster'] = kmeans.fit_predict(scaled_usage)

    # Assign readable labels
    cluster_means = df.groupby('cluster')['y'].mean().sort_values()
    labels = {idx: label for idx, label in zip(cluster_means.index, ['Low', 'Medium', 'High'])}
    df['cluster_label'] = df['cluster'].map(labels)

    # Prepare final result
    result = df[['ds', 'y', 'cluster_label']].to_dict(orient='records')
    return JsonResponse(result, safe=False)


class SendLiveDataEmailView(APIView):
    def post(self, request):
        email_to = request.data.get("email")

        if not email_to:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get today’s start and now timestamps
        today_start = make_aware(datetime.combine(datetime.today(), time.min))
        now = make_aware(datetime.now())

        # Filter only today's data
        data = MachineData.objects.filter(timestamp__range=(today_start, now)).values(
            "machine_id", "timestamp", "temperature", "voltage", "current", "power", "energy"
        )

        if not data:
            return Response({"error": "No data available for today."}, status=status.HTTP_404_NOT_FOUND)

        # Create CSV
        csv_buffer = io.StringIO()
        writer = csv.DictWriter(csv_buffer, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)

        # Email setup
        email = EmailMessage(
            subject="📊 Today's Live Machine Data",
            body="Attached is the live machine data collected today.",
            to=[email_to],
        )
        email.attach("live_data.csv", csv_buffer.getvalue(), "text/csv")
        email.send()

        return Response({"message": "Email sent successfully!"}, status=status.HTTP_200_OK)



