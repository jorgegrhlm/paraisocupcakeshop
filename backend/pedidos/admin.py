from django.contrib import admin

from .models import Pedido, LineaPedido


class LineaPedidoInline(admin.TabularInline):
    """Líneas mostradas dentro del Pedido. Se ven y editan en la misma página."""
    model = LineaPedido
    extra = 0
    readonly_fields = ['producto', 'cantidad', 'precio_unitario', 'subtotal_display']
    can_delete = False

    def subtotal_display(self, obj):
        return obj.subtotal() if obj.pk else '-'
    subtotal_display.short_description = 'Subtotal'

    def has_add_permission(self, request, obj=None):
        # Las líneas se crean SIEMPRE desde la API al hacer el pedido.
        return False


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'estado', 'total', 'creado']
    list_filter = ['estado', 'creado']
    search_fields = ['id', 'usuario__username', 'usuario__email']
    date_hierarchy = 'creado'
    readonly_fields = ['usuario', 'total', 'creado', 'actualizado']
    fields = [
        'usuario',
        'estado',
        'direccion_envio',
        'telefono_contacto',
        'total',
        'creado',
        'actualizado',
    ]
    inlines = [LineaPedidoInline]
    ordering = ['-creado']