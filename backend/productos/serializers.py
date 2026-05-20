from rest_framework import serializers
from .models import Categoria, Producto, ImagenProducto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug', 'descripcion', 'imagen']
        read_only_fields = ['slug']


class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = ['id', 'imagen', 'descripcion', 'orden']


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    categoria_slug = serializers.CharField(source='categoria.slug', read_only=True)
    imagenes = ImagenProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion', 'precio',
            'imagen', 'imagenes',
            'categoria', 'categoria_nombre', 'categoria_slug',
            'destacado', 'disponible', 'unidades_por_pack', 'creado', 'actualizado',
        ]
        read_only_fields = ['slug', 'creado', 'actualizado']