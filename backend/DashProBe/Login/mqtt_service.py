import os
import django
import json
import threading
import paho.mqtt.client as mqtt
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils.timezone import now as timezone_now
from django.utils.dateparse import parse_datetime
from django.db import transaction
from .models import MachineData
from .models import Machine, MachineData


# Optional: only needed if this runs outside manage.py context
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')
# django.setup()

BROKER = "broker.mqtt.cool"
PORT = 1883
TOPIC = "machine/data"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT broker!")
        client.subscribe(TOPIC)
        print(f"📡 Subscribed to topic: {TOPIC}")
    else:
        print(f"❌ Connection failed with code {rc}")

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())
        print(f"📩 Received MQTT Data: {data}")

        machine_id = data.get("machine_id")
        timestamp = parse_datetime(data.get("timestamp"))

        # 🔧 Automatically create machine if it doesn't exist
        machine, created = Machine.objects.get_or_create(id=machine_id)

        if created:
            print(f"🆕 Created new machine entry: {machine_id}")

        # Save incoming machine data
        with transaction.atomic():
            MachineData.objects.create(
                machine=machine,  # ForeignKey to Machine
                temperature=data.get("temperature", 0.0),
                voltage=data.get("voltage", 0.0),
                current=data.get("current", 0.0),
                power=data.get("power", 0.0),
                energy=data.get("energy", 0.0),
                status=data.get("status", "off"),
                timestamp=timestamp
            )

        # Send to WebSocket clients
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "machine_data_group",
            {
                "type": "send_machine_data",
                "data": data
            }
        )
        print("🚀 Data sent to WebSocket Clients")

    except json.JSONDecodeError:
        print("⚠️ Error decoding MQTT message")
    except Exception as e:
        print(f"❗ Error handling MQTT message: {e}")

def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER, PORT, 60)
    client.loop_forever()

def get_latest_mqtt_data():
    """Fetch the latest machine data from the database."""
    latest_data = MachineData.objects.order_by('-id').first()
    if latest_data:
        return {
            "temperature": latest_data.temperature,
            "voltage": latest_data.voltage,
            "current": latest_data.current,
            "power": latest_data.power,
        }
    return None

# Run MQTT listener in a background thread
mqtt_thread = threading.Thread(target=start_mqtt, daemon=True)
mqtt_thread.start()
