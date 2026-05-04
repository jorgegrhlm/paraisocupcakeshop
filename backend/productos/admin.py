from django.contrib import admin
from .models import Categoria, Producto, ImagenProducto


class ImagenProductoInline(admin.TabularInline):
    model = ImagenProducto
    extra = 1
    fields = ('imagen', 'descripcion', 'orden')
    ordering = ('orden', 'id')


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre']


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'precio', 'destacado', 'disponible']
    list_filter = ['categoria', 'destacado', 'disponible']
    search_fields = ['nombre']
    inlines = [ImagenProductoInline]