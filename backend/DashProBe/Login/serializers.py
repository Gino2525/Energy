from rest_framework import serializers
from .models import  User
from .models import  Cluster,EnergyPrediction,MachineData


class UserSerializers(serializers.ModelSerializer):
    class Meta:
        Model=User 
        fields='__all__'

class ClusterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cluster
        fields = '__all__'  


class EnergyInputSerializer(serializers.Serializer):
    feature1 = serializers.FloatField()
    feature2 = serializers.FloatField()
    feature3 = serializers.FloatField()

class EnergyPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyPrediction
        fields = '__all__' 

from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'age', 'profile_image']

class MachineDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineData
        fields = '__all__'