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
        ('bizum', 'Bizum'),
        ('transferencia', 'Transferencia'),
    ]

    INTERVALO_CHOICES = [
        ('09-12', '09:00 - 12:00'),
        ('12-15', '12:00 - 15:00'),
        ('15-18', '15:00 - 18:00'),
        ('18-21', '18:00 - 21:00'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    direccion_envio = models.TextField()
    telefono_contacto = models.CharField(max_length=20)
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
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Pedido {self.id} - {self.usuario.username} - {self.estado}'

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
