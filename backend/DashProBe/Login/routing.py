from django.urls import re_path
from Login.consumers import MachineDataConsumer  # Replace `your_app` with actual app name

websocket_urlpatterns = [
    re_path(r"ws/machine-data/$", MachineDataConsumer.as_asgi()),  # No `^`

]
