from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RegistroView,
    MeView,
    CambiarPasswordView,
    FavoritoViewSet,
)


# Router para los endpoints REST estilo ViewSet (favoritos).
# El resto de vistas (registro, me, cambiar-password) son APIView
# clásicas y siguen declarándose con path() explícito.
router = DefaultRouter()
router.register('favoritos', FavoritoViewSet, basename='favorito')


urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('me/', MeView.as_view(), name='me'),
    path('cambiar-password/', CambiarPasswordView.as_view(), name='cambiar_password'),
    # Mount del router al final: añade /favoritos/ y /favoritos/{id}/
    # bajo este mismo prefijo /api/usuarios/.
    path('', include(router.urls)),
]