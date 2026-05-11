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
      - direccion_envio
      - telefono_contacto
      - lineas (lista con producto + cantidad)

    Campos que pone el servidor:
      - usuario (del request.user)
      - estado (siempre 'pendiente' al crear)
      - total (suma de subtotales calculados con el precio real)
      - precio_unitario de cada línea
    """

    lineas = LineaPedidoSerializer(many=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id',
            'usuario',
            'usuario_username',
            'estado',
            'direccion_envio',
            'telefono_contacto',
            'total',
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

    def validate_lineas(self, value):
        if not value:
            raise serializers.ValidationError(
                'El pedido debe tener al menos una línea.'
            )
        return value

    def create(self, validated_data):
        lineas_data = validated_data.pop('lineas')
        usuario = self.context['request'].user

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