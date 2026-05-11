from rest_framework import viewsets, permissions

from .models import Pedido
from .serializers import PedidoSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    """ViewSet de pedidos del usuario autenticado.

    Operaciones permitidas:
      - GET  /api/pedidos/        → lista de pedidos del usuario actual.
      - GET  /api/pedidos/{id}/   → detalle de un pedido propio.
      - POST /api/pedidos/        → crea un pedido nuevo.

    NO se permite editar ni borrar pedidos desde la API del cliente:
    el cambio de estado lo realiza el personal desde el panel de admin.
    """

    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        # Cada usuario solo ve SUS propios pedidos.
        return (
            Pedido.objects
            .filter(usuario=self.request.user)
            .prefetch_related('lineas__producto')
        )