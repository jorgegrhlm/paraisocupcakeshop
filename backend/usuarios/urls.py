from django.urls import path
from .views import RegistroView, MeView, CambiarPasswordView

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('me/', MeView.as_view(), name='me'),
    path('cambiar-password/', CambiarPasswordView.as_view(), name='cambiar_password'),
]