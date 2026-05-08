from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    UserSerializer,
    UserRegistroSerializer,
    CambiarPasswordSerializer,
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