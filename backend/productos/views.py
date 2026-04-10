from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'descripcion']

    def get_queryset(self):
        queryset = Producto.objects.all()
        categoria = self.request.query_params.get('categoria')
        destacado = self.request.query_params.get('destacado')

        if categoria:
            queryset = queryset.filter(categoria__id=categoria)
        if destacado:
            queryset = queryset.filter(destacado=True)

        return queryset

    @action(detail=False, methods=['get'])
    def destacados(self, request):
        destacados = Producto.objects.filter(destacado=True, disponible=True)
        serializer = self.get_serializer(destacados, many=True)
        return Response(serializer.data)
