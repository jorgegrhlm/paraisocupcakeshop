from rest_framework import serializers
from django.db import transaction

from .models import Pedido, LineaPedido


class LineaPedidoSerializer(serializers.ModelSerializer):
    """Serializer para cada línea del pedido.

    En escritura SOLO se aceptan `producto` y `cantidad`. El `precio_unitario`
    lo establece el servidor leyendo el precio actual del Producto: nunca
    confiamos en el precio que mande el cliente.
    """

    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = LineaPedido
        fields = [
            'id',
            'producto',
            'producto_nombre',
            'cantidad',
            'precio_unitario',
            'subtotal',
        ]
        read_only_fields = ['id', 'precio_unitario']

    def get_subtotal(self, obj):
        return obj.subtotal()

    def validate_cantidad(self, value):
        if value < 1:
            raise serializers.ValidationError('La cantidad debe ser al menos 1.')
        return value

    def validate_producto(self, value):
        if not value.disponible:
            raise serializers.ValidationError(
                f'El producto "{value.nombre}" no está disponible.'
            )
        return value


class PedidoSerializer(serializers.ModelSerializer):
    """Serializer principal de pedidos con líneas anidadas (writable).

    Campos que el cliente envía al crear:
      - nombre_cliente
      - email_cliente
      - direccion_envio
      - codigo_postal
      - ciudad
      - estado_provincia
      - pais
      - telefono_contacto
      - costo_envio
      - metodo_pago
      - fecha_entrega
      - intervalo_entrega
      - nota_pedido (opcional)
      - lineas (lista con producto + cantidad)

    Campos que pone el servidor:
      - usuario (request.user si está autenticado; None si es compra anónima)
      - estado (siempre 'pendiente' al crear)
      - total (suma de subtotales de las líneas, NO incluye costo_envio)
      - precio_unitario de cada línea
    """

    lineas = LineaPedidoSerializer(many=True)
    # SerializerMethodField en vez de source='usuario.username' para que no
    # explote cuando el pedido es anónimo (usuario = None).
    usuario_username = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = [
            'id',
            'usuario',
            'usuario_username',
            'estado',
            'nombre_cliente',
            'email_cliente',
            'direccion_envio',
            'codigo_postal',
            'ciudad',
            'estado_provincia',
            'pais',
            'telefono_contacto',
            'costo_envio',
            'total',
            'metodo_pago',
            'fecha_entrega',
            'intervalo_entrega',
            'nota_pedido',
            'creado',
            'actualizado',
            'lineas',
        ]
        read_only_fields = [
            'id',
            'usuario',
            'estado',
            'total',
            'creado',
            'actualizado',
        ]

    def get_usuario_username(self, obj):
        return obj.usuario.username if obj.usuario else None

    def validate_lineas(self, value):
        if not value:
            raise serializers.ValidationError(
                'El pedido debe tener al menos una línea.'
            )
        return value

    def create(self, validated_data):
        lineas_data = validated_data.pop('lineas')
        request = self.context['request']
        # Compra anónima: si el request no está autenticado, usuario = None.
        usuario = request.user if request.user.is_authenticated else None

        with transaction.atomic():
            pedido = Pedido.objects.create(usuario=usuario, **validated_data)

            total = 0
            for linea_data in lineas_data:
                producto = linea_data['producto']
                cantidad = linea_data['cantidad']
                precio = producto.precio  # precio actual del producto
                LineaPedido.objects.create(
                    pedido=pedido,
                    producto=producto,
                    cantidad=cantidad,
                    precio_unitario=precio,
                )
                total += cantidad * precio

            pedido.total = total
            pedido.save(update_fields=['total'])

        return pedido