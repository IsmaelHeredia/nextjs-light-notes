Light Notes es una aplicación web minimalista para la gestión de workspaces y notas, construida con Next.js, persistencia local con SQLite, ORM Drizzle, y pruebas de integración usando Vitest.

El proyecto está pensado para ser simple, rápido, sin depender de servicios externos.

## Funcionalidades principales

### Gestión de Workspaces

- Crear workspaces

- Listar todos los workspaces

- Actualizar el nombre de un workspace

- Eliminar workspaces

### Gestión de Notas

- Crear notas asociadas a un workspace

- Listar notas por workspace

- Actualizar el contenido de una nota

- Eliminar notas

### Instalación del proyecto

**1.** Clonar el repositorio

```
git clone <url>
cd light-notes
```

**2.** Instalación de dependencias

```
npm install
```

**3.** Variables de entorno

Crea un archivo .env en la raíz del proyecto:

```
NODE_ENV=development
```

**4.** Inicializar la base de datos

Para crear la bd:

```
npx drizzle-kit generate
npx drizzle-kit migrate
```

**5.** Para ejecutar los seeds de prueba:

```
npm run seed
```

**6.** Ejecución del proyecto en modo desarrollo

```
npm run dev
```

**7.** Build de producción

```
npm run build
npm start
```

### Pruebas de integración

El proyecto incluye tests de integración reales sobre las rutas API.

Para ejecutar los tests:

```
npm test
```