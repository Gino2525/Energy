import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import MachineData  # Import your model
from django.utils.dateparse import parse_datetime  # To convert string to datetime object

class MachineDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("machine_data_group", self.channel_name)
        await self.accept()
        print("✅ WebSocket Connection Established")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("machine_data_group", self.channel_name)
        print("❌ WebSocket Disconnected")

    async def receive(self, text_data):
        print(f"📩 Received message from WebSocket: {text_data}")

        # Parse the incoming JSON
        data = json.loads(text_data)

        # Save to database (sync_to_async if needed)
        from asgiref.sync import sync_to_async

        await sync_to_async(MachineData.objects.create)(
            machine_id=data["machine_id"],
            temperature=data["temperature"],
            voltage=data["voltage"],
            current=data["current"],
            power=data["power"],
            energy=data["energy"],
            status=data["status"],
            timestamp=parse_datetime(data["timestamp"])
        )

        print(f"💾 Stored data for {data['machine_id']} at {data['timestamp']}")

    async def send_machine_data(self, event):
        data = event["data"]
        await self.send(text_data=json.dumps(data))
