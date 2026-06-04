from django.db import models
from django.contrib.auth.models import User


class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('preparando', 'Preparando'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]

    METODO_PAGO_CHOICES = [
        ('tarjeta', 'Tarjeta de crédito'),
        ('pagomovil', 'Pago Movil'),
        ('transferencia', 'Transferencia'),
    ]

    INTERVALO_CHOICES = [
        ('09-12', '09:00 - 12:00'),
        ('12-15', '12:00 - 15:00'),
        ('15-18', '15:00 - 18:00'),
        ('18-21', '18:00 - 21:00'),
    ]

    # Usuario nullable para permitir compra anónima (Sprint V).
    usuario = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='pedidos',
        null=True,
        blank=True,
    )
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')

    # Datos del cliente que rellena el form de Facturación.
    nombre_cliente = models.CharField(max_length=200, blank=True, default='')
    email_cliente = models.EmailField(blank=True, default='')

    # Dirección de envío desglosada.
    direccion_envio = models.TextField(blank=True, default='')
    codigo_postal = models.CharField(max_length=10, blank=True, default='')
    ciudad = models.CharField(max_length=100, blank=True, default='')
    estado_provincia = models.CharField(max_length=100, blank=True, default='')
    pais = models.CharField(max_length=100, blank=True, default='')

    telefono_contacto = models.CharField(max_length=20)

    # Importes.
    costo_envio = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    metodo_pago = models.CharField(
        max_length=20,
        choices=METODO_PAGO_CHOICES,
        default='tarjeta',
    )

    fecha_entrega = models.DateField(null=True, blank=True)
    intervalo_entrega = models.CharField(
        max_length=10,
        choices=INTERVALO_CHOICES,
        null=True,
        blank=True,
    )

    nota_pedido = models.TextField(blank=True, default='')

    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        cliente = self.usuario.username if self.usuario else (self.nombre_cliente or 'anónimo')
        return f'Pedido {self.id} - {cliente} - {self.estado}'

    class Meta:
        ordering = ['-creado']


class LineaPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='lineas')
    producto = models.ForeignKey('productos.Producto', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f'{self.cantidad} x {self.producto.nombre}'

    def subtotal(self):
        return self.cantidad * self.precio_unitario
