from django.db import models
from django.utils import timezone
# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField(default=25)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def __str__(self):
        return self.name 

class Cluster(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Maintenance'),
        ('optimized', 'Optimized'),
    ]
    id = models.AutoField(primary_key=True)  # or models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    average_consumption= models.FloatField()    
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )

    def __str__(self):
        return self.name
    


class EnergyPrediction(models.Model):
    feature1 = models.FloatField()
    feature2 = models.FloatField()
    feature3 = models.FloatField()
    predicted_value = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Machine(models.Model):
    id = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.machine_id

class MachineData(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    temperature = models.FloatField()
    voltage = models.FloatField()
    current = models.FloatField()
    power = models.FloatField()
    energy = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=20, default='non active')



    def __str__(self):
        return f"{self.timestamp} | Temp: {self.temperature}°C, Voltage: {self.voltage}V"

class EnergyForecast(models.Model):
    timestamp = models.DateTimeField()
    predicted_power = models.FloatField()

    def __str__(self):
        return f"Forecast @ {self.timestamp}: {self.predicted_power}W"
