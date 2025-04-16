from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, LoggedInView, ClusterViewSet,PredictEnergyView,MachineDataListView,EnergyForecastingView,cluster_usage_view,SendLiveDataEmailView

router = DefaultRouter()
router.register(r'clusters', ClusterViewSet, basename='cluster')

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),  
    path('loggedin/', LoggedInView.as_view(), name='loggedin'),  
    path('cluster/', include(router.urls)),  # ✅ This automatically creates CRUD routes for `ClusterViewSet`
    path("predict-energy/", PredictEnergyView.as_view(), name="predict_energy"),
    path("machine/data/", MachineDataListView.as_view(), name="machine-data"),
    path('forecast/', EnergyForecastingView.as_view(), name='energy-forecast'),
    path('clusters/usage/', cluster_usage_view, name='cluster-usage'),
    path('livedata/', MachineDataListView.as_view(), name='machine-data-list'),
    path("send-live-data-email/", SendLiveDataEmailView.as_view(), name="send_live_data_email"),


]
