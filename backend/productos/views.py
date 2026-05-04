from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    lookup_field = 'slug'


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.select_related('categoria').all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'descripcion']
    lookup_field = 'slug'

    ORDERING_PERMITIDO = {'precio', '-precio', 'creado', '-creado', 'nombre', '-nombre'}

    def get_queryset(self):
        queryset = Producto.objects.select_related('categoria').all()
        params = self.request.query_params

        categoria = params.get('categoria')
        categoria_slug = params.get('categoria_slug')
        destacado = params.get('destacado')
        disponible = params.get('disponible')
        ordering = params.get('ordering')

        if categoria:
            queryset = queryset.filter(categoria__id=categoria)
        if categoria_slug:
            queryset = queryset.filter(categoria__slug=categoria_slug)
        if destacado in ('true', '1'):
            queryset = queryset.filter(destacado=True)
        if disponible in ('true', '1'):
            queryset = queryset.filter(disponible=True)
        if ordering in self.ORDERING_PERMITIDO:
            queryset = queryset.order_by(ordering)

        return queryset

    @action(detail=False, methods=['get'])
    def destacados(self, request):
        destacados = Producto.objects.filter(destacado=True, disponible=True)
        serializer = self.get_serializer(destacados, many=True)
        return Response(serializer.data)
