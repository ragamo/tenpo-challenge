Tenpo Challenge 2025

# Requisitos

- Node.js > 20.x
- npm > 10.x

## Instalar dependencias

```bash
npm i
```

# Ejecutar el proyecto

```bash
npm run build
npm run prod
```

Luego navegar a: http://localhost:3000

Autenticar con cualquier nombre de usuario y contraseña.

# Modo desarrollo

```bash
npm run dev
```

# Stack utilizado

- React + TypeScript
- Tailwind CSS
- TanStack Router
- TanStack Query
- Vite
- Express (fake api)

# Descripción de requerimientos

- Desarrollar una app en react con typescript que sea responsiva (web y mobile).

  > Solución implementa React con TypeScript y Tailwind CSS.

- Almacenar token en memoria, seleccionar la forma/herramienta/librería que se crea
  más conveniente para este propósito (persistencia de token).

  > Token es persistido utilizando localStorage en [auth.tsx](src/auth.tsx), valida su vencimiento al recargar la página.

- Definir el diseño/arquitectura que creas más conveniente para tener un contex público (login) y privado (home) que luego te permita crecer en el tiempo con
  nuevos módulos. Ej: módulo de cambio de contraseña (público) ó módulo de datos
  del usuario (privado).

  > Solución implementa Context API en [auth.tsx](src/auth.tsx). Rutas privadas deben comprobar `context.auth.isAuthenticated`.

- Usar axios para el fetching y configurarlo para enviar el token-fake en las reques

  > Access token es inyectado por medio de un interceptor de axios en [services/radios.service.ts](src/services/radios.service.ts)

- Definir la mejor forma bajo su criterio para mostrar la lista de la home argumentando en unas pocas líneas su solución.

  > Solución implementa un [VirtualList](src/components/VirtualList.tsx) con el fin de optimizar el renderizado quitando elementos que no sean visibles en pantalla.

- Proponer una mejora teórica sobre las llamadas usadas al backend para que nuestra app sea más eficiente.
  > Implementar un sistema de paginación o una estrategia de streaming que permita recibir elementos en chunks (de 100 por ejemplo).
