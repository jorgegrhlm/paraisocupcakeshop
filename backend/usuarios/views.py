from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Favorito
from .serializers import (
    UserSerializer,
    UserRegistroSerializer,
    CambiarPasswordSerializer,
    FavoritoSerializer,
)


def _generar_tokens_jwt(user):
    """Crea un par access/refresh para el usuario indicado."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegistroView(APIView):
    """POST /api/usuarios/registro/

    Crea un usuario nuevo (junto con su perfil) y devuelve un par de
    tokens JWT para que el cliente quede autenticado inmediatamente,
    evitando obligar a hacer login después del registro.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistroSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        tokens = _generar_tokens_jwt(user)

        return Response(
            {
                'user': UserSerializer(user).data,
                **tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class MeView(generics.RetrieveUpdateAPIView):
    """GET, PUT, PATCH /api/usuarios/me/

    Devuelve y permite actualizar los datos del usuario autenticado.
    El cliente identifica al usuario con la cabecera Authorization
    Bearer <access_token>; nunca con un id en la URL.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class CambiarPasswordView(APIView):
    """POST /api/usuarios/cambiar-password/

    Cambia la contraseña del usuario autenticado tras validar la
    contraseña actual. Esto evita que alguien que se haya sentado en
    una sesión abierta pueda cambiar la contraseña sin conocer la
    actual.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CambiarPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['password_actual']):
            return Response(
                {'password_actual': ['Contraseña actual incorrecta.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data['password_nueva'])
        user.save()
        return Response(
            {'detail': 'Contraseña actualizada correctamente.'},
            status=status.HTTP_200_OK,
        )

class FavoritoViewSet(viewsets.ModelViewSet):
    """ViewSet de favoritos del usuario autenticado.

    Operaciones permitidas:
      - GET    /api/usuarios/favoritos/        → lista de favoritos del usuario actual.
      - POST   /api/usuarios/favoritos/        → añade un producto a favoritos.
      - DELETE /api/usuarios/favoritos/{id}/   → elimina un favorito por id.

    No se permite list/retrieve de favoritos de otros usuarios: el
    queryset filtra siempre por request.user, así que aunque un cliente
    intente acceder al detalle de un favorito ajeno por su id obtendrá
    un 404.

    El método create es idempotente: si el producto ya estaba marcado
    como favorito por el usuario, devuelve el favorito existente con
    código 200 OK, en lugar de error 400 por violación de unique_together.
    Esto simplifica el frontend (puede llamar a POST sin tener que mirar
    primero si ya existe).
    """

    serializer_class = FavoritoSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        # Cada usuario solo ve SUS propios favoritos.
        return (
            Favorito.objects
            .filter(usuario=self.request.user)
            .select_related('producto')
        )

    def create(self, request, *args, **kwargs):
        # Validamos primero con el serializer para que el producto
        # exista y sea válido. Después get_or_create garantiza la
        # idempotencia frente al unique_together (usuario, producto).
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        producto = serializer.validated_data['producto']
        favorito, creado = Favorito.objects.get_or_create(
            usuario=request.user,
            producto=producto,
        )
        # Devolvemos la representación completa (con datos del producto
        # denormalizados) para evitar al cliente una segunda petición.
        response_serializer = self.get_serializer(favorito)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED if creado else status.HTTP_200_OK,
        )