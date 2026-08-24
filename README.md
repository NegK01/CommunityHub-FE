# CommunityHub - Frontend

Frontend de la plataforma comunitaria CommunityHub, construido con Nuxt 4, Vue 3, TypeScript, SASS y capacidades PWA para trabajar en conjunto con el backend `CommunityHub-BE`.

---

## Requisitos Previos

- Node.js 22.19.0 o superior
- npm 10.x o superior
- Backend `CommunityHub-BE` en ejecucion

---

## Instalacion y Configuracion

1. Instalar dependencias:

```bash
cd CommunityHub-FE
npm install
```

2. Configurar variables de entorno:
Crear un archivo `.env` en la raiz del proyecto con el siguiente contenido:

```env
NUXT_API_TARGET=http://localhost:3000/api
NUXT_PUBLIC_API_BASE_URL=/api-proxy
```

3. Verificar que el backend este disponible en el puerto configurado y con acceso a MongoDB.
El frontend usa un proxy interno (`/api-proxy`) para reenviar solicitudes al backend y evitar problemas de CORS o dominios distintos en PWA y dispositivos moviles.

---

## Scripts Disponibles

- `npm run dev`: Inicia el frontend en modo desarrollo en `http://localhost:3001`.
- `npm run build`: Genera la compilacion de produccion con soporte PWA.
- `npm run preview`: Levanta la compilacion generada para pruebas locales.
- `npm run generate`: Genera la version estatica del proyecto cuando aplique.

---

## Funcionalidades Implementadas

### 1. Autenticacion

- Inicio de sesion con JWT consumiendo `/api/auth/login`
- Registro de usuarios consumiendo `/api/auth/register`
- Restauracion de sesion mediante `/api/auth/me`
- Cierre de sesion consumiendo `/api/auth/logout`

### 2. Dashboard

- Dashboard por rol (`user`, `organizer`, `admin`)
- Resumen de metricas y accesos rapidos
- Persistencia visual cuando la aplicacion entra en modo offline

### 3. Modulos Principales

- Eventos:
  - Listado con filtros por texto, categoria, ubicacion, fecha, proximidad y cupos
  - Creacion y edicion para `organizer` y `admin`
  - Cancelacion de eventos para duenio o administrador
  - Favoritos e inscripciones desde la interfaz

- Categorias:
  - Listado general para cualquier usuario autenticado
  - Creacion, edicion y desactivacion para `admin`

- Usuarios:
  - Busqueda, filtrado, cambio de roles y eliminacion para `admin`

- Notificaciones:
  - Listado del usuario autenticado
  - Marcado individual y masivo como leidas

- Favoritos:
  - Consulta y eliminacion de eventos favoritos

- Inscripciones:
  - Consulta y cancelacion de inscripciones activas

- Perfil:
  - Actualizacion de nombre, apellido y foto de perfil

### 4. PWA y Offline

- Manifest configurado para instalacion
- Service worker generado con `@vite-pwa/nuxt`
- Cache de assets y respuestas GET del API
- Pantalla `/offline` para navegacion sin conexion
- Banner de estado de red dentro de la aplicacion
- Recuperacion de datos cacheados para dashboard, eventos, categorias, usuarios, favoritos, inscripciones y notificaciones

### 5. Estilo y Estructura

- SASS como capa de estilos global y por componente
- Paginas construidas con componentes de archivo unico separados en `template`, `script` y `style`
- Layout autenticado y layout de acceso

---

## Estructura General

```text
CommunityHub-FE/
├── app/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   └── pages/
├── assets/
├── composables/
├── middleware/
├── plugins/
├── public/
├── types/
├── nuxt.config.ts
└── package.json
```

---

## Consideraciones Tecnicas

- El frontend se sirve en el puerto `3001`.
- El backend debe exponer su API bajo `/api`.
- El navegador no necesita conectarse directamente al backend si se usa el proxy interno de Nuxt.
- Nuxt 4.5.2 requiere Node.js `22.19.0` o superior. Con versiones anteriores puede funcionar parcialmente, pero aparecen advertencias de compatibilidad.
- Para build de produccion en entornos Windows con restricciones de PowerShell puede ser necesario usar `npm.cmd run build`.

---

## Credenciales de Prueba

Si se ejecuto el `seed` del backend, se pueden usar:

- Administrador: `admin@communityhub.com` / `password123`
- Organizador: `organizer@communityhub.com` / `password123`
- Usuario: `user@communityhub.com` / `password123`

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
