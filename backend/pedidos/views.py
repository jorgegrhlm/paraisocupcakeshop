from rest_framework import viewsets, permissions

from .models import Pedido
from .serializers import PedidoSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    """ViewSet de pedidos.

    Operaciones permitidas:
      - GET  /api/pedidos/        → lista de pedidos del usuario actual (requiere auth).
      - GET  /api/pedidos/{id}/   → detalle de un pedido propio (requiere auth).
      - POST /api/pedidos/        → crea un pedido nuevo (admite compra anónima, Sprint V).

    NO se permite editar ni borrar pedidos desde la API del cliente:
    el cambio de estado lo realiza el personal desde el panel de admin.
    """

    serializer_class = PedidoSerializer
    http_method_names = ['get', 'post', 'head', 'options']

    def get_permissions(self):
        # Compra anónima: el POST está abierto a todos (logueado o no).
        # El resto (GET list/retrieve) sigue requiriendo autenticación,
        # porque cada usuario solo puede ver SUS propios pedidos.
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Cada usuario solo ve SUS propios pedidos.
        # Este queryset solo se usa en list/retrieve, que ya requieren auth,
        # así que self.request.user nunca será AnonymousUser aquí.
        return (
            Pedido.objects
            .filter(usuario=self.request.user)
            .prefetch_related('lineas__producto')
        )