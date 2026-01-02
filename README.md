**Light Notes** es una aplicación web minimalista para la gestión de workspaces y notas, construida con **Next.js**, persistencia local con **SQLite**, **Drizzle ORM**, y pruebas de integración usando **Vitest**.

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

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEirgs2laTtqQp_rKPb9cHHWy-xWdpc9W5n41UBQ8CgrtZk88ae0l-gfFDS0gamcK9e9dtfimZa9Lht5Tge4XyNA58Gt5g0gg99wphfTIugf0U5JgsHSzwLrhzw5q_BcPswbqGevRecEq0kmaivcHXg17t0uKXVs4lkqbIGb7paFMUWrwhn7KoQrNea7ZTw/s1849/1.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg7wUfYVMDfp_hTIguhUlbofYFjIUButEnE3Uwv7CAHfGTm1YFLJcTYKbZ07Ag4fNO8uduw2iOXGoqp-ajGWqnKgdtRUe99vlcJ1uquOLEaauFPrA0nWKClnCO-0Mk5cA1N8i2yVIQPcITgfGmFMp6lNgQlc33f7SbfW9rcKjuBMhBhQkbQArVLvClRUxY/s1856/2.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB9xHdFHQQ0biIQVXkn5dyeKNZuM6Z4_50K-FW1CeMGgohyBkuDI1AEYH-I-TvO5wdlYnbT1PTF5FP65hl74OIJeAsD17myHHkSuA7CQhDmsbbJNQEwfLf3VmcvuHRNhuYO1vHmYDh7m0WriEr6_EMyXPTK9JTY3XkUmLyvoS53B4HsbP7hVZJhiA5140/s1848/3.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEisXH9-lrezWa1dKKAJ-Tzx8DlUczdQ0o0vxgFLXoISNDC9Hk95WoL0fjwdlFlpm7bAwUR50LOBTBOFbeTTlYaEshtIbOvR9yoYHyYFHpoh0roJj-oGbpA3wK6RgEKiU-QfOPRWsTbtHOBW4zc0nSH3uKhO9ZyiC9UUlHrTz0vRhGpcW0MXLVj7r8q1M94/s1855/4.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh33-ItsV2yjEDbO2SHxsYCna3Q6i_LxxhzMQT5aTDGKg7_JJ7WB0FBCYjCKye32z2C_nQHaNNYTOljllPf2nhn2bYm7tJeJhtxBAyWZlohU5vkNiassX6Euaw8TWaclezCE8DA2CEV9_We-zV72H7BbwGd2AKpUSdQqrGbFKfub1R_6-JO59lTMx11rfU/s1848/5.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjO8O5OwbMyTeWzYSuD9Glws9jYroJJY-quVYsXvypeWSNINw5RuiVCZFCWjaFZOJYuUdxawFQv2TjaRBddUQ6p1ZEKx9YMmvGduhsqBA5HPtx6VRHh7-rZ2k_0n0roU06ROqakM67G_5BIg5QLcr0qyOkTdmqC7SAExCPWeqXFFO5NS3FhcQBDRzzevm4/s1853/6.png)

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