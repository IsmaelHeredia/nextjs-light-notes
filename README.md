Light Notes es una aplicación web minimalista para la gestión de workspaces y notas, construida con **Next.js**, persistencia local con **SQLite**, **Drizzle ORM**, y pruebas de integración usando **Vitest**.

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

### Buscador

El buscador permite filtrar las notas dentro del workspace activo, combinando distintos criterios de texto y fecha.

Los filtros disponibles son:

**Búsqueda por texto**

- Filtra las notas cuyo contenido incluya el texto ingresado.

**Filtros rápidos por fecha**

- **Hoy:** muestra notas creadas en el día actual.

- **Ayer:** muestra notas creadas el día anterior.

- **Esta semana:** muestra notas desde el inicio de la semana hasta hoy.

- **Este mes:** muestra notas del mes y año actuales.

- Los filtros rápidos son **excluyentes** entre sí.

**Filtro por año**

- Permite mostrar solo notas creadas en un año específico.

- Puede combinarse con otros filtros.

**Rango de fechas personalizado**

- **Desde:** fecha mínima de creación de la nota.

- **Hasta:** fecha máxima de creación de la nota.

**Combinación de filtros**

- Los filtros pueden combinarse (por ejemplo: texto + mes, o texto + rango de fechas).

## Capturas de pantalla

A continuación, se muestran algunas imágenes de la aplicación en funcionamiento:

![screenshot]()

![screenshot]()

![screenshot]()

![screenshot]()

![screenshot]()

![screenshot]()

### Instalación del proyecto

**1.** Clonar el repositorio

```
git clone https://github.com/IsmaelHeredia/nextjs-light-notes.git
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
npm run generate
npm run migrate
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

### Uso con Docker

Para poner en marcha el servicio de **NextJS** usando **Docker**, se debe ejecutar el siguiente comando:

```
docker compose up -d --build
```

Una vez que el servicio esté activo, se podra acceder desde las siguiente URL:

```
http://localhost:3000
```