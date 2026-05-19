from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Perfil, Favorito


class PerfilSerializer(serializers.ModelSerializer):
    """Datos extendidos del usuario (teléfono, dirección, imagen)."""

    class Meta:
        model = Perfil
        fields = ['telefono', 'direccion', 'imagen']


class UserRegistroSerializer(serializers.ModelSerializer):
    """Crea un usuario nuevo y su perfil asociado en un único POST."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )
    telefono = serializers.CharField(
        required=False, allow_blank=True, max_length=20
    )
    direccion = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name',
            'telefono', 'direccion',
        ]
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_email(self, value):
        # Django no fuerza la unicidad de email por defecto. La forzamos aquí.
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                'Ya existe una cuenta con este correo electrónico.'
            )
        return value

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden.'
            })
        return attrs

    def create(self, validated_data):
        # Sacamos los campos de Perfil antes de crear el User
        telefono = validated_data.pop('telefono', '')
        direccion = validated_data.pop('direccion', '')
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        # create_user() hashea la contraseña automáticamente con set_password()
        user = User.objects.create_user(**validated_data, password=password)

        # Creamos el Perfil asociado al User recién creado
        Perfil.objects.create(
            usuario=user,
            telefono=telefono,
            direccion=direccion,
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """Datos del usuario para ver y editar su propio perfil.
    Incluye los datos de Perfil anidados (telefono, direccion, imagen).
    """

    perfil = PerfilSerializer(required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email',
            'first_name', 'last_name',
            'date_joined', 'perfil',
        ]
        read_only_fields = ['id', 'username', 'date_joined']

    def update(self, instance, validated_data):
        # Separamos los datos del Perfil para actualizar ambas tablas
        perfil_data = validated_data.pop('perfil', None)

        # Actualizar el User
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        # Actualizar el Perfil si vino en la petición
        if perfil_data is not None:
            perfil, _ = Perfil.objects.get_or_create(usuario=instance)
            for field, value in perfil_data.items():
                setattr(perfil, field, value)
            perfil.save()

        return instance


class CambiarPasswordSerializer(serializers.Serializer):
    """Cambia la contraseña del usuario autenticado.
    Pide la contraseña actual para validar identidad antes de cambiar.
    """

    password_actual = serializers.CharField(write_only=True, required=True)
    password_nueva = serializers.CharField(
        write_only=True, required=True,
        validators=[validate_password],
    )
    password_nueva_confirm = serializers.CharField(
        write_only=True, required=True,
    )

    def validate(self, attrs):
        if attrs['password_nueva'] != attrs['password_nueva_confirm']:
            raise serializers.ValidationError({
                'password_nueva_confirm': 'Las contraseñas nuevas no coinciden.'
            })
        return attrs

class FavoritoSerializer(serializers.ModelSerializer):
    """Serializer para la relación de un producto marcado como favorito.

    En escritura SOLO se acepta `producto` (id). El usuario se asigna
    en el viewset desde request.user, nunca desde el cliente. Para
    lectura se devuelven datos denormalizados del producto (nombre,
    slug, precio, imagen) de forma que el frontend pueda listar los
    favoritos sin hacer una segunda petición al catálogo.
    """

    producto_nombre = serializers.CharField(
        source='producto.nombre', read_only=True
    )
    producto_slug = serializers.CharField(
        source='producto.slug', read_only=True
    )
    producto_precio = serializers.DecimalField(
        source='producto.precio',
        read_only=True,
        max_digits=8,
        decimal_places=2,
    )
    producto_imagen = serializers.ImageField(
        source='producto.imagen', read_only=True
    )

    class Meta:
        model = Favorito
        fields = [
            'id',
            'producto',
            'producto_nombre',
            'producto_slug',
            'producto_precio',
            'producto_imagen',
            'creado',
        ]
        read_only_fields = ['id', 'creado']