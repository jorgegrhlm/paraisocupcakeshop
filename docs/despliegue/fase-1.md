# Fase 1 del despliegue a producción — Paraíso Cupcake Shop

Material para el apartado **7.7 Despliegue y mantenimiento** de la memoria del proyecto.
Fecha: 5 de septiembre de 2026.

## Objetivo de la fase

Dejar el código de la aplicación preparado para un entorno de producción real,
trabajando únicamente en local y sin contratar ningún servicio. La tienda física
está en Venezuela, así que la aplicación se localiza para ese país.

## Punto de partida

La aplicación estaba configurada como proyecto de desarrollo: clave secreta escrita
en el código, `DEBUG = True`, CORS abierto a cualquier origen, servidor de desarrollo
de Django (`runserver`), base de datos expuesta al exterior y dos parches en el
frontend que reescribían las URL de las imágenes a `localhost`.

## Cambios realizados

### 1. Separación entre configuración y código

`settings.py` ya no contiene ningún dato sensible. La clave secreta, el modo debug,
los hosts permitidos y las credenciales de la base de datos se leen con la librería
**python-decouple** desde un archivo `.env` que no se sube al repositorio. Se añadió
un `.env.example` como plantilla, de forma que cualquiera pueda reproducir el entorno
sin conocer los valores reales.

Este es el principio de las *doce factor apps*: el mismo código funciona en
desarrollo y en producción, y lo único que cambia es la configuración del entorno.

### 2. Preparación para `DEBUG = False`

- **`STATIC_ROOT`**: con el modo debug desactivado Django deja de servir los archivos
  estáticos. El comando `collectstatic` los reúne (162 archivos) en una carpeta que
  sirve el servidor web.
- **`CORS_ALLOWED_ORIGINS`**: se sustituyó `CORS_ALLOW_ALL_ORIGINS = True` por una
  lista blanca de orígenes, de modo que solo el dominio de la tienda puede consumir la API.
- **`CSRF_TRUSTED_ORIGINS`**: dominios de confianza para los formularios del panel de administración.
- **Cookies seguras**: cuando `DEBUG` es `False` se activan `SESSION_COOKIE_SECURE` y
  `CSRF_COOKIE_SECURE`, y se declara `SECURE_PROXY_SSL_HEADER` para que Django reconozca
  como seguras las peticiones que le llegan desde Nginx.

### 3. Localización para Venezuela

`TIME_ZONE = 'America/Caracas'` y `LANGUAGE_CODE = 'es-ve'`. Con `USE_TZ = True` las
fechas se almacenan en UTC en la base de datos y se muestran en hora local de Caracas,
que es el comportamiento correcto para las fechas de los pedidos.

### 4. Servidor de aplicaciones

El servidor `runserver` de Django es de un solo hilo y está explícitamente desaconsejado
en producción. Se añadió **Gunicorn** con tres procesos de trabajo como comando por
defecto de la imagen del backend. El `docker-compose.yml` de desarrollo lo sustituye
por `runserver`, de modo que la recarga automática se conserva mientras se programa.

### 5. Imagen del frontend en dos etapas (multi-stage)

Se creó un `Dockerfile.prod` con dos etapas:

1. Una imagen de Node compila la aplicación de React (`npm run build`).
2. Una imagen de Nginx recibe únicamente el resultado compilado y lo sirve.

La imagen final no contiene Node ni las dependencias de desarrollo: pasa de cientos de
megabytes a una imagen mínima. Nginx además hace de proxy hacia Django para `/api/` y
`/admin/`, y sirve directamente las imágenes de los productos y los estáticos del
administrador, tarea que en producción ya no hace Django.

### 6. Composición de producción

`docker-compose.prod.yml`, separado del de desarrollo. Dos decisiones de seguridad:

- La base de datos **deja de publicar el puerto 5432**. Solo es accesible desde la red
  interna de Docker; ningún equipo de fuera puede conectarse a ella.
- El backend tampoco publica puerto: se llega a él solo a través de Nginx. El único
  puerto abierto al exterior es el 80.

La contraseña de la base de datos pasa a ser una cadena aleatoria almacenada en el `.env`.

### 7. Corrección de dos errores que rompían las imágenes

`CartSidebar.jsx` y `Carrito.jsx` contenían un parche que reemplazaba
`http://backend:8000` por `http://localhost:8000` en las URL de las imágenes. En
producción eso apunta al ordenador del cliente y las fotos del carrito no se verían
nunca. Se sustituyó por la función `getImageUrl()` que ya usaba el resto de la
aplicación y que devuelve una ruta relativa, resuelta por Nginx.

## Verificación

Se levantó la pila completa de producción en local y se comprobó:

| Comprobación | Resultado |
|---|---|
| Los tres contenedores arrancan y la base de datos pasa el healthcheck | Correcto |
| Gunicorn sirve la aplicación con tres workers | Correcto |
| La base de datos no expone ningún puerto al exterior | Correcto |
| La web de React carga en el puerto 80 | Correcto |
| El panel de administración se ve con sus estilos (`/static/`) | Correcto |
| Un producto creado desde el administrador muestra su imagen (`/media/`) | Correcto |

## Commits de esta fase

```
feat: leer configuracion sensible desde variables de entorno con python-decouple
feat: configurar idioma es-ve y zona horaria America/Caracas
feat: preparar settings para produccion con STATIC_ROOT, CORS y CSRF restringidos
fix: usar getImageUrl en carrito y sidebar para que las imagenes funcionen en produccion
feat: anadir gunicorn y CMD de produccion al Dockerfile del backend
feat: anadir dockerfile multi-stage y nginx para el frontend en produccion
feat: anadir docker-compose de produccion sin exponer la base de datos
```

## Pendiente para la siguiente fase

Contratación de hosting y dominio, certificado HTTPS, copias de seguridad automáticas
de la base de datos, y sustitución de los precios por un botón de "Precio a consultar"
que muestre los contactos de la tienda (WhatsApp y correo).
