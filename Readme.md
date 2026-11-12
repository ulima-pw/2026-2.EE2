# Programación Web – Ejercicios de práctica: Express + JavaScript (ES Modules)

Este documento contiene **10 ejercicios**:

- **Ejercicios 1 al 5:** solo backend (Express). Los ejercicios **2 y 4** usan **Prisma + PostgreSQL con un solo modelo**; los ejercicios 1, 3 y 5 guardan los datos en memoria.
- **Ejercicios 6 al 10:** backend + frontend (React + Vite + Tailwind CSS), a partir del proyecto base `frontend-base/`. Todos usan **Prisma + PostgreSQL con varios modelos** relacionados.

| # | Ejercicio | Tipo | Datos | Dificultad |
|---|-----------|------|-------|------------|
| 1 | Utilidades de bienvenida y conversión | Backend | — | ★☆☆☆☆ |
| 2 | Catálogo de productos | Backend | Prisma + PostgreSQL (modelo `Product`) | ★★☆☆☆ |
| 3 | Registro de notas de un curso | Backend | Memoria | ★★★☆☆ |
| 4 | Biblioteca con búsqueda y paginación | Backend | Prisma + PostgreSQL (modelo `Book`) | ★★★★☆ |
| 5 | Encuestas en vivo | Backend | Memoria | ★★★★☆ |
| 6 | Frases célebres | Backend + Frontend | Prisma + PostgreSQL | ★★★☆☆ |
| 7 | Inscripción a talleres | Backend + Frontend | Prisma + PostgreSQL | ★★★☆☆ |
| 8 | Recetario con porciones y calificaciones | Backend + Frontend | Prisma + PostgreSQL | ★★★★☆ |
| 9 | Cotizador de pedidos | Backend + Frontend | Prisma + PostgreSQL | ★★★★★ |
| 10 | Reserva de salas de estudio (integrador) | Backend + Frontend | Prisma + PostgreSQL | ★★★★★ |

---

## Reglas generales (aplican a TODOS los ejercicios)

1. **Backend con Express y JavaScript**, utilizando **ES Modules** (`"type": "module"` en `package.json`, `import` / `export`; **no** se permite `require` ni `module.exports`).
2. **Solo endpoints `GET` y `POST`.** No se usan `PUT`, `PATCH` ni `DELETE`. Si una operación cambia el estado de un recurso (ej. cancelar), se modela como un `POST` sobre una sub‑ruta (ej. `POST /reservations/:code/cancel`).
3. **Persistencia de datos:**
   - **Ejercicios 1, 3 y 5:** **no se usa base de datos**. Los datos viven en memoria, en arreglos exportados desde un módulo (por ejemplo `src/data/courses.data.js`). Al reiniciar el servidor, los datos vuelven a su estado inicial; eso es lo esperado.
   - **Ejercicios 2 y 4:** **Prisma (ORM) + PostgreSQL** con **un solo modelo**.
   - **Ejercicios 6 al 10:** **Prisma + PostgreSQL** con **varios modelos** relacionados (relaciones, `include`).
   - En los ejercicios con base de datos los datos **persisten** entre reinicios. Ver *Configuración adicional para ejercicios con base de datos (Prisma + PostgreSQL)*.
   - **El backend es la fuente de verdad de los datos:** la estructura de la base se define **únicamente** en `prisma/schema.prisma` y se aplica con **migraciones** (`prisma migrate dev`); no se crean tablas a mano ni desde el código. Las migraciones se versionan junto con el backend y los datos iniciales se cargan con un *seed* (`prisma/seed.js`). El frontend nunca define ni duplica la estructura ni los cálculos: solo muestra lo que responde la API.
4. Todos los ejercicios refuerzan las tres formas de recibir datos:
   - **Path parameters** → `req.params` (ej. `/products/:id`)
   - **Query parameters** → `req.query` (ej. `/products?category=Laptops`)
   - **Payload (body)** → `req.body` (ej. JSON enviado en un `POST`)
5. Recuerde que `req.params` y `req.query` **siempre llegan como `string`** (o `undefined`). Debe convertirlos (`Number(...)`, comparaciones con `"true"`, etc.) y validarlos.
6. Las respuestas de error deben tener el formato `{ "message": "..." }` y usar el código HTTP adecuado: `400` (datos inválidos), `404` (no encontrado), `409` (conflicto con el estado actual).
7. El código debe estar organizado en **módulos**: las rutas se definen directamente en `src/index.js` con `app.get(...)` / `app.post(...)` (**no** se usan archivos de rutas ni `express.Router`); los datos (o `prisma/` y `src/prisma.js` en los ejercicios con base de datos) y los servicios con la lógica de negocio (`src/services/`, cuando el ejercicio lo indica) sí van en módulos aparte.
8. **Variables de entorno con `dotenv`** (backend): la configuración (`DATABASE_URL`, `PORT`, ...) va en un archivo `.env` que **no se sube al repositorio** (`.gitignore`); se entrega un `.env.example` con los nombres de las variables. Se cargan con `import "dotenv/config";` al inicio de `src/index.js`, de `src/prisma.js` y de `prisma.config.js`.
9. Los ejercicios 6 al 10 incluyen un **frontend con React + JavaScript (Vite) + Tailwind CSS** que consume el backend con `fetch` (dentro de `useEffect`), partiendo del proyecto base `frontend-base/`.

---

## Configuración base del backend

```bash
mkdir ejercicio-01 && cd ejercicio-01
npm init -y
npm install express cors dotenv
npm install -D nodemon
```

**package.json** (fragmento relevante):

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js"
  }
}
```

> No se necesita compilación ni `tsconfig.json`: Node ejecuta directamente los archivos `.js`. **nodemon** reinicia el servidor cada vez que se guarda un cambio; se usa con `npm run dev`.

**Estructura sugerida:**

```
├── .env                  # variables de entorno (NO se sube al repositorio)
├── .env.example          # plantilla con los nombres de las variables
├── prisma/               # solo ejercicios con base de datos: schema.prisma, migrations/, seed.js
├── prisma.config.js      # solo ejercicios con base de datos
└── src/
    ├── index.js          # crea la app, registra middlewares y define TODAS las rutas
    ├── prisma.js         # solo ejercicios con base de datos: cliente de Prisma
    ├── services/         # lógica de negocio (funciones puras exportadas)
    ├── middlewares/      # middlewares reutilizables (a partir del ejercicio 3)
    └── data/             # arreglos en memoria con datos iniciales (ejercicios sin base de datos)
```

**src/index.js** de referencia:

```js
import "dotenv/config";   // carga las variables del archivo .env en process.env
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/greetings/:name", (req, res) => {
  const { name } = req.params;
  const { lang = "es" } = req.query;
  // ... validar lang y responder
  res.json({ message: `Hola, ${name}!` });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```

> ⚠️ Con ES Modules en Node los imports relativos **deben** llevar la extensión del archivo (`.js`): `import { calculateBmi } from "./services/tools.service.js";`

**Lectura de `params`, `query` y `body`:**

```js
// En src/index.js, después de crear `app`:

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id); // siempre llega como string
  // ...
});

app.get("/products", (req, res) => {
  const { category, maxPrice } = req.query; // string | undefined
  // ...
});

app.post("/products", (req, res) => {
  const { name, price } = req.body; // puede venir cualquier cosa: ¡valide!
  // ...
});
```

## Configuración adicional para ejercicios con base de datos (Prisma + PostgreSQL)

Aplica a los ejercicios **2, 4 y 6 al 10**. Se usa **Prisma** como ORM sobre **PostgreSQL**. La estructura de la base se define en `prisma/schema.prisma` (fuente de verdad) y los cambios se aplican con migraciones.

**1. Levantar PostgreSQL.** Junto a este documento se entrega `docker-compose.yml`:

```bash
docker compose up -d      # inicia PostgreSQL en el puerto 5432
docker compose down -v    # borra todo y empieza de cero
```

Se crea la base `talleres` (usuario `postgres`, contraseña `postgres`). Si prefiere una instalación local de PostgreSQL, cree una base llamada `talleres` y ajuste `DATABASE_URL`.

**2. Instalar dependencias:**

```bash
npm install @prisma/client @prisma/adapter-pg
npm install -D prisma
```

> Prisma 7 requiere Node 20.19 o superior.

**3. Variables de entorno (`dotenv`).** Archivo `.env` en la raíz del backend (agréguelo a `.gitignore` y entregue un `.env.example` con el mismo contenido):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/talleres?schema=public"
PORT=3000
```

> Prisma **no** lee el `.env` por sí solo: por eso `prisma.config.js` y `src/prisma.js` empiezan con `import "dotenv/config";`. Si modifica el `.env`, reinicie `npm run dev` (nodemon solo vigila el código).

**4. `prisma/schema.prisma`** (ejemplo con un modelo ilustrativo `Note`; en cada ejercicio defina los suyos):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model Note {
  id        Int      @id @default(autoincrement())
  title     String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

**5. `prisma.config.js`** (en la raíz del backend; indica dónde está el esquema, la URL de la base y el comando del *seed*):

```js
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "node prisma/seed.js" },
  datasource: { url: env("DATABASE_URL") },
});
```

**6. Comandos de Prisma:**

| Comando | Qué hace |
|---------|----------|
| `npx prisma migrate dev --name init` | Crea una migración a partir de los cambios en `schema.prisma`, la aplica a la base y regenera el cliente. **Se ejecuta cada vez que cambia el esquema** (con un nombre descriptivo: `add_stock`, ...). |
| `npx prisma generate` | Regenera el cliente (`@prisma/client`). Ejecútelo después de clonar el proyecto y de `npm install`. |
| `npx prisma db seed` | Ejecuta `prisma/seed.js` (datos iniciales). |
| `npx prisma migrate reset` | Borra la base, vuelve a aplicar todas las migraciones y ejecuta el *seed*. Útil para empezar de cero. |
| `npx prisma studio` | Interfaz web para ver y editar los datos de las tablas. |

Flujo de trabajo: editar `schema.prisma` → `npx prisma migrate dev --name <cambio>` → usar el cliente en el código. La carpeta `prisma/migrations/` **se versiona** (se entrega con el proyecto).

**7. `src/prisma.js`** (una única instancia del cliente, reutilizada en todo el backend):

```js
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
```

**8. `prisma/seed.js`** (datos iniciales; debe ser **idempotente**: no duplicar datos si se ejecuta dos veces):

```js
import { prisma } from "../src/prisma.js";

if ((await prisma.note.count()) === 0) {
  await prisma.note.createMany({
    data: [{ title: "Estudiar Express" }, { title: "Practicar Prisma" }],
  });
}
await prisma.$disconnect();
```

**9. Consultas más usadas** (desde `src/index.js`; los handlers son `async`):

```js
import { prisma } from "./prisma.js";

// Varios registros, con filtros opcionales y orden
const notes = await prisma.note.findMany({
  where: { done: false, title: { contains: "express", mode: "insensitive" } },
  orderBy: { createdAt: "desc" },
});

// Un registro por clave (null si no existe)
const note = await prisma.note.findUnique({ where: { id } });

// Crear (retorna el registro creado, con su id)
const created = await prisma.note.create({ data: { title } });

// Paginación y conteo
const page = await prisma.note.findMany({ skip: 10, take: 5 });
const total = await prisma.note.count({ where: { done: false } });

// Agregaciones y agrupaciones
const stats = await prisma.note.aggregate({ _count: true, _avg: { id: true } });
const groups = await prisma.note.groupBy({ by: ["done"], _count: { _all: true } });

// Relaciones: traer datos relacionados, o solo contarlos (ejemplo con el modelo Workshop del ejercicio 7)
const workshops = await prisma.workshop.findMany({
  include: { _count: { select: { registrations: true } } },
});
```

Los filtros que no llegan en la petición **no** deben incluirse en `where`: construya el objeto dinámicamente (`const where = {}; if (category) where.category = {...};`).

**10. Transacciones (opcional, no se exige en ningún ejercicio)**: sirven cuando varias operaciones deben cumplirse todas o ninguna, o cuando hay que evitar condiciones de carrera, por ejemplo dos personas tomando la última vacante. Se incluyen solo como referencia:

```js
const result = await prisma.$transaction(async (tx) => {
  // bloquea la fila mientras dura la transacción (consulta parametrizada con plantilla)
  await tx.$queryRaw`SELECT id FROM "Workshop" WHERE id = ${id} FOR UPDATE`;

  const workshop = await tx.workshop.findUnique({
    where: { id },
    include: { _count: { select: { registrations: true } } },
  });
  // ... validar y crear con tx.registration.create(...)
  // si se lanza un error aquí dentro, se hace ROLLBACK automáticamente
});
```

> Use siempre `tx.$queryRaw` con **plantilla** (`` $queryRaw`... ${valor}` ``): el valor se envía como parámetro. **Nunca** use `$queryRawUnsafe` con datos del usuario.

**Detalles importantes de Prisma:**

- Las columnas `Decimal` llegan como objetos `Decimal`: conviértalas con `Number(valor)` antes de calcular o responder.
- Los campos `DateTime @db.Date` llegan como `Date`: para responder `YYYY-MM-DD` use `fecha.toISOString().slice(0, 10)`; para consultar por fecha use `new Date("2026-11-20T00:00:00.000Z")`.
- Errores frecuentes: `P2002` (violación de restricción única → responder `409`) y `P2025` (registro no encontrado en `update`). Se leen en `err.code`.
- Búsquedas sin distinguir mayúsculas/minúsculas: `{ contains: texto, mode: "insensitive" }` o `{ equals: texto, mode: "insensitive" }`.
- Los parámetros de `req.params`/`req.query` llegan como `string`: conviértalos (`Number(...)`) antes de pasarlos a Prisma, que es estricto con los tipos.
- Con Express 5 (la versión actual de `npm install express`) un error lanzado dentro de un handler `async` llega automáticamente al manejador de errores; aun así, valide y responda `400`/`404`/`409` explícitamente.

## Configuración base del frontend (ejercicios 6 al 10)

Junto a este documento se entrega el proyecto base **`frontend-base/`** (React + Vite + Tailwind CSS) con todo lo necesario para conectarse al backend. Para cada ejercicio con frontend, cópielo dentro de su proyecto:

```bash
cp -r frontend-base ejercicio-06/frontend
cd ejercicio-06/frontend
npm install
cp .env.example .env     # solo si no existe .env
npm run dev
```

> Requiere Node 20.19 o superior (Vite 8).

El frontend se ejecuta en `http://localhost:5173` y el backend en `http://localhost:3000`.

**El proyecto base ya trae TODA la interfaz construida.** No tiene que crear componentes visuales: en cada ejercicio **modifica los que ya existen** (props, estado, efectos, llamadas a la API y, si hace falta, su aspecto). Abra el frontend y verá las pantallas de los ejercicios 6 al 10 funcionando con datos de ejemplo; su trabajo es **reemplazar esos datos de ejemplo por los del backend**.

| Ubicación | Qué contiene |
|-----------|--------------|
| `.env` / `.env.example` | Variable `VITE_API_URL` con la URL del backend. Si el backend usa otro puerto, cámbiela aquí. |
| `src/constants.js` | Exporta `API_URL` leyendo `VITE_API_URL`; se importa en las páginas para armar las URLs de `fetch`. |
| `src/components/ui/` | Kit de componentes reutilizables ya estilizados con Tailwind: `Button`, `Field`, `Input`, `Select`, `Checkbox`, `Card`, `Badge`, `Alert`, `ErrorMessage`, `Loading`, `Table`, `StarRating`, `Tabs`. |
| `src/exercises/ex06/` ... `ex10/` | Una carpeta por ejercicio con sus componentes visuales y una **página** (`QuotesPage`, `WorkshopsPage`, `RecipesPage`, `OrderPage`, `RoomsPage`) que contiene el estado y los comentarios `// TODO` con lo que debe implementar. Cada carpeta incluye `sample.js` con datos de ejemplo. |
| `src/exercises/ex09/cartReducer.js` | Esqueleto del reducer del carrito (usted lo implementa). |
| `src/hooks/useFetch.js` | Esqueleto del hook `useFetch` del ejercicio 10 (usted lo implementa). |
| `src/ConnectionTest.jsx` | Pantalla "Probar conexión" para verificar que el backend responde y que CORS está habilitado. **Es el ejemplo** de `fetch` dentro de un `useEffect`. |
| `src/App.jsx` | Menú con una pestaña por ejercicio. En su proyecto puede dejar solo la pestaña del ejercicio que resuelve. |
| `src/index.css`, `vite.config.js` | Tailwind CSS ya configurado (`@import "tailwindcss";` + plugin `@tailwindcss/vite`). |

**Cómo trabajar sobre los componentes existentes:**

1. Abra la página del ejercicio (`src/exercises/exNN/...Page.jsx`) y busque los `// TODO`.
2. Reemplace los datos de ejemplo (`sample.js`) por datos reales: haga el `fetch` **directamente dentro de `useEffect`** (no se usa un módulo `api.js`) y guarde el resultado con `useState`. Los `POST` se hacen en el *handler* del evento (envío del formulario, clic).
3. Si el contrato de un componente (sus `props`) no le alcanza, **modifique ese componente**; no cree otro nuevo.
4. Cuando termine, puede borrar `sample.js` y las pestañas de los demás ejercicios.

**Patrón para pedir datos (`fetch` dentro de `useEffect`):**

```jsx
import { useEffect, useState } from "react";
import { API_URL } from "../../constants.js";

// GET que se repite cuando cambian los filtros
useEffect(() => {
  const controller = new AbortController();

  async function loadQuotes() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();           // query params
      if (author) params.set("author", author);
      if (category) params.set("category", category);

      const response = await fetch(`${API_URL}/quotes?${params}`, { signal: controller.signal });
      const data = await response.json();
      if (!response.ok) {
        setError({ message: data.message, status: response.status }); // 400, 404, 409...
        return;
      }
      setQuotes(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError({ message: "No se pudo conectar con el servidor", status: 0 });
      }
    } finally {
      setLoading(false);
    }
  }

  loadQuotes();
  return () => controller.abort();   // limpieza: cancela la petición anterior
}, [author, category]);               // dependencias
```

```jsx
// POST: se hace en el handler del evento (envío del formulario)
async function handleSubmit() {
  setSubmitting(true);
  const response = await fetch(`${API_URL}/workshops/${workshop.id}/registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  const data = await response.json();
  if (!response.ok) setError({ message: data.message, status: response.status });
  else setSuccess("Inscripción registrada");
  setSubmitting(false);
}
```

Un ejemplo completo y funcionando está en `src/ConnectionTest.jsx`.

**Reglas del frontend:**

- Los `GET` que cargan datos se hacen con `fetch` **directamente dentro de `useEffect`** (con sus dependencias y una función de limpieza); los `POST`, dentro del *handler* del evento. Los componentes visuales no hacen peticiones: reciben datos y funciones por `props`.
- Siempre muestre en la interfaz el `message` que devuelve el backend cuando hay error: verifique `response.ok`, guarde `{ message, status }` y páselo al componente `ErrorMessage` (distingue visualmente `400`, `404` y `409`).
- Opcional: documente la forma de los datos con comentarios JSDoc (`@typedef`).
- Los estilos ya están hechos con Tailwind CSS; si ajusta un componente, hágalo con clases de Tailwind (no se requiere CSS propio).
- El backend es la fuente de verdad: el frontend no inventa la estructura de los datos ni calcula valores derivados (totales, vacantes, promedios, estados); los muestra tal como los devuelve la API.

<details>
<summary>¿Cómo se creó el proyecto base? (referencia, no es necesario repetirlo)</summary>

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
```

En `vite.config.js` se agrega `tailwindcss()` a `plugins` y en `src/index.css` se reemplaza todo el contenido por `@import "tailwindcss";`.

</details>

---

# PARTE A — Solo backend

---

## Ejercicio 1 — Utilidades de bienvenida y conversión ★☆☆☆☆

**Objetivo:** dar los primeros pasos con Express + JavaScript + ES Modules, distinguiendo claramente path params, query params y body.

### Organización requerida

- `src/index.js` → define las rutas `/greetings/:name`, `/tools/temperature` y `/tools/bmi`.
- `src/services/tools.service.js` → exporta funciones puras (`celsiusToFahrenheit`, `calculateBmi`, etc.) que son usadas por las rutas de `index.js`.

### Endpoints

**a) `GET /greetings/:name`** — *path param + query param opcional*

- `:name` es el nombre de la persona.
- Query param opcional `lang` con valores `es` (por defecto), `en` o `pt`.
- Respuesta `200`:

```
GET /greetings/Ana?lang=en
```
```json
{ "message": "Hello, Ana!" }
```

- Si `lang` tiene un valor distinto a los permitidos → `400` con `{ "message": "Idioma no soportado" }`.

**b) `GET /tools/temperature`** — *solo query params*

- Query params obligatorios: `value` (número), `from` y `to` (`C`, `F` o `K`).
- Respuesta `200`:

```
GET /tools/temperature?value=30&from=C&to=F
```
```json
{ "value": 30, "from": "C", "to": "F", "result": 86 }
```

- `400` si falta algún parámetro, si `value` no es numérico o si la unidad no es válida.
- El resultado debe redondearse a 2 decimales.

**c) `POST /tools/bmi`** — *payload*

- Body: `{ "weight": 70, "height": 1.75 }` (kg y metros).
- Calcula el IMC = `weight / height²` y la categoría: `BAJO PESO` (< 18.5), `NORMAL` (< 25), `SOBREPESO` (< 30), `OBESIDAD` (≥ 30).
- Respuesta `200`:

```json
{ "bmi": 22.86, "category": "NORMAL" }
```

- `400` si `weight` o `height` no son números mayores a 0.

### Criterios de aceptación

- [ ] El proyecto usa `"type": "module"` y todos los archivos usan `import`/`export`.
- [ ] Las rutas se definen en `src/index.js` con `app.get(...)` y `app.post(...)`, sin archivos de rutas.
- [ ] Los query params se convierten (`Number(...)`) y validan antes de usarse.
- [ ] El body se valida explícitamente (tipo y rango de cada campo) antes de usarse.
- [ ] Los cálculos están en el módulo de servicios, no dentro de las rutas.

---

## Ejercicio 2 — Catálogo de productos con Prisma ★★☆☆☆

**Objetivo:** primer contacto con un ORM: un solo modelo, migraciones, filtros opcionales combinables con `where`, búsqueda por path param y creación de registros vía body.

### Base de datos

- Configure Prisma y PostgreSQL según *Configuración adicional para ejercicios con base de datos*.
- Modelo `Product` en `prisma/schema.prisma`: `id` (`Int`, `@id @default(autoincrement())`), `name` (`String`, `@unique`), `category` (`String`), `price` (`Decimal @db.Decimal(10, 2)`) y `stock` (`Int`).
- Cree la migración con `npx prisma migrate dev --name init`.
- `prisma/seed.js` carga **al menos 8 productos** solo si la tabla está vacía.

```js
// Ejemplo de datos iniciales
{ name: "Laptop Lenovo IdeaPad", category: "Laptops", price: 2899.9, stock: 5 },
{ name: "Mouse Logitech M170", category: "Accesorios", price: 49.9, stock: 0 },
```

### Endpoints

**a) `GET /products`** — *query params opcionales combinables*

| Query param | Descripción |
|-------------|-------------|
| `category`  | Filtra por categoría (sin distinguir mayúsculas/minúsculas). |
| `minPrice`  | Precio mínimo (inclusive). |
| `maxPrice`  | Precio máximo (inclusive). |
| `inStock`   | Si es `"true"`, solo productos con `stock > 0`. |

```
GET /products?category=laptops&maxPrice=3000&inStock=true
```

- Construya el objeto `where` dinámicamente, agregando solo los filtros que lleguen (`category: { equals, mode: "insensitive" }`, `price: { gte, lte }`, `stock: { gt: 0 }`).
- `400` si `minPrice` o `maxPrice` no son numéricos, o si `minPrice > maxPrice`.
- Si ningún producto cumple los filtros, retorna `200` con `[]`.
- Recuerde que `Decimal` no es un número de JavaScript: devuelva `price` como número.

**b) `GET /products/:id`** — *path param*

- `400` si `:id` no es un número entero.
- `404` si no existe.
- `200` con el producto.

**c) `POST /products`** — *payload*

- Body: `{ "name": "...", "category": "...", "price": 99.9, "stock": 10 }`.
- Validaciones (`400`): `name` y `category` no vacíos; `price > 0`; `stock` entero `>= 0`.
- `409` si ya existe un producto con el mismo `name` **sin distinguir mayúsculas/minúsculas**. `@unique` solo detecta nombres idénticos, así que primero busque con `findFirst({ where: { name: { equals: name, mode: "insensitive" } } })`; además capture el error `P2002` como respaldo.
- El `id` lo genera la base de datos. Retorna `201` con el producto creado.

**d) `GET /categories/:category/summary`** — *path param + agregaciones*

```
GET /categories/Laptops/summary
```
```json
{ "category": "Laptops", "productCount": 3, "averagePrice": 3266.63, "totalStock": 12 }
```

- Use `prisma.product.aggregate({ where, _count: true, _avg: { price: true }, _sum: { stock: true } })`; convierta los resultados a número y redondee el promedio a 2 decimales.
- `404` si la categoría no tiene productos.

### Criterios de aceptación

- [ ] La estructura de la tabla está definida solo en `schema.prisma` y existe su carpeta `prisma/migrations/`.
- [ ] `prisma/seed.js` es idempotente (al ejecutarlo dos veces **no** duplica productos).
- [ ] Las credenciales viven en `.env` (cargado con `dotenv`); existe `.env.example` y `.env` está en `.gitignore`.
- [ ] Los filtros de `GET /products` son opcionales e independientes (se puede enviar cualquiera, todos o ninguno).
- [ ] El producto creado con `POST` aparece luego en `GET /products` y en `GET /products/:id`, **y sigue ahí después de reiniciar el servidor**.
- [ ] Se usan correctamente los códigos `200`, `201`, `400`, `404` y `409`.

---

## Ejercicio 3 — Registro de notas de un curso ★★★☆☆

**Objetivo:** combinar path params + query params + body en una misma ruta, usar un middleware sobre rutas con parámetros, separar la lógica en servicios y crear un middleware de validación reutilizable.

### Contexto

Se tienen varios cursos en memoria (`src/data/courses.data.js`), cada uno con su lista de notas registradas:

```js
export const courses = [
  { id: "PW", name: "Programación Web", grades: [] },
  { id: "BD", name: "Base de Datos", grades: [] },
];
```

El **promedio final** se calcula así:

- Promedio de prácticas (`practices`, arreglo de 4 notas) **eliminando la nota más baja**: 30 %.
- Examen parcial (`midterm`): 30 %.
- Examen final (`final`): 40 %.
- Se redondea a 2 decimales. Estado `APROBADO` si el promedio es `>= 10.5`, de lo contrario `DESAPROBADO`.

### Organización requerida

```
src/index.js                      # define todas las rutas /courses/:courseId/...
src/services/grades.service.js    # calculateFinalGrade, getStatus, paginate...
src/middlewares/validateCourse.js # verifica que :courseId exista (404) y lo deja en res.locals
```

### Endpoints

**a) `POST /courses/:courseId/grades`** — *path param + payload*

```json
{ "studentCode": "20231234", "studentName": "Ana Torres", "practices": [12, 15, 9, 18], "midterm": 14, "final": 16 }
```

- `404` si el curso no existe (resuelto por el middleware).
- `400` si `studentCode` no tiene 8 dígitos, si `practices` no es un arreglo de exactamente 4 números, o si alguna nota no está entre 0 y 20.
- `409` si el alumno ya tiene notas registradas en ese curso.
- `201` con el registro creado, incluyendo `finalGrade` y `status` calculados por el backend.

**b) `GET /courses/:courseId/grades`** — *path param + query params*

| Query param | Descripción |
|-------------|-------------|
| `status`    | `APROBADO` o `DESAPROBADO` (opcional). Otro valor → `400`. |
| `sort`      | `asc` o `desc` por `finalGrade` (opcional, por defecto `desc`). |
| `page`      | Número de página (por defecto `1`). |
| `limit`     | Elementos por página (por defecto `5`, máximo `20`). |

Respuesta `200`:

```json
{
  "course": "PW",
  "page": 1,
  "limit": 5,
  "total": 12,
  "totalPages": 3,
  "data": [ { "studentCode": "20231234", "studentName": "Ana Torres", "finalGrade": 15.4, "status": "APROBADO" } ]
}
```

**c) `GET /courses/:courseId/grades/:studentCode`** — *dos path params*

- `404` si el curso o el alumno no existen. `200` con el detalle completo del alumno (incluye las prácticas y cuál fue la nota eliminada).

**d) `GET /courses/:courseId/stats`**

```json
{ "course": "PW", "students": 12, "average": 13.21, "highest": 18.4, "lowest": 7.9, "approvalRate": 75 }
```

- Si no hay notas registradas, retorna `200` con `students: 0` y el resto de valores en `null`.

### Criterios de aceptación

- [ ] Todas las rutas `/courses/:courseId/...` se definen en `src/index.js` y usan `validateCourse` como middleware, por ejemplo `app.get("/courses/:courseId/grades", validateCourse, (req, res) => {...})`.
- [ ] El middleware `validateCourse` se reutiliza en todas las rutas que reciben `:courseId`.
- [ ] Las funciones de cálculo (promedio, estado, paginación) están en `grades.service.js` y no dependen de `req`/`res`.
- [ ] La paginación y el ordenamiento funcionan correctamente combinados con el filtro `status`.

---

## Ejercicio 4 — Biblioteca con búsqueda y paginación (Prisma) ★★★★☆

**Objetivo:** construir un endpoint de búsqueda con múltiples query params (filtros, orden y paginación) traduciéndolos a una consulta dinámica y segura con Prisma (`where`, `orderBy`, `skip`/`take`) sobre un solo modelo.

### Base de datos

- Modelo `Book` en `prisma/schema.prisma`: `isbn` (`String`, `@id`), `title`, `author`, `genre` (`String`), `year` (`Int`), `pages` (`Int`) y `available` (`Boolean`). Cree la migración con `npx prisma migrate dev --name init`.
- `prisma/seed.js` inserta **al menos 40 libros** (guarde el arreglo en `prisma/data/books.js` e impórtelo en el seed) solo si la tabla está vacía; use `createMany`.

### Endpoints

- **`GET /books`** con los siguientes query params opcionales:

| Query param | Descripción |
|-------------|-------------|
| `q`         | Texto a buscar en título o autor (`contains` con `mode: "insensitive"`, combinando título y autor con `OR`). |
| `genre`     | Género exacto. |
| `yearFrom` / `yearTo` | Rango de años (inclusive). `400` si `yearFrom > yearTo`. |
| `available` | `true` / `false`. |
| `sort`      | `title`, `year` o `pages` (por defecto `title`). |
| `order`     | `asc` o `desc` (por defecto `asc`). |
| `page`, `limit` | Paginación (por defecto `1` y `10`; `limit` máximo `50`). |

Respuesta:

```json
{ "data": [ ... ], "page": 2, "limit": 10, "total": 23, "totalPages": 3 }
```

  - `sort` y `order` los envía el usuario: valídelos contra una lista blanca y recién entonces úselos en `orderBy: { [sort]: order }`.
  - La paginación se resuelve **en la base de datos** con `skip` y `take`; el `total` se obtiene con `prisma.book.count({ where })` usando **el mismo `where`** que la consulta de datos.

- **`GET /books/:isbn`** → detalle. `404` si no existe.
- **`GET /genres`** → `[{ "genre": "Fantasía", "count": 8 }, ...]` (use `groupBy` con `_count`).
- **`POST /books`** → body con los datos del libro. `400` si el `isbn` no tiene 13 dígitos, el año es futuro o `pages <= 0`; `409` si el ISBN ya existe (error `P2002`). `201` con el libro creado.

Implemente las funciones de paginación en `src/services/pagination.service.js` (no deben depender de `req`/`res`):

```js
// Valida page y limit (400 si no son enteros positivos o limit > 50)
// y calcula cuántos registros omitir (skip) para Prisma.
export function getPagination(page, limit) {
  // retorna { page, limit, skip }
}

// Arma la respuesta final.
export function buildPaginatedResponse(data, total, page, limit) {
  // retorna { data, page, limit, total, totalPages }
}
```

### Criterios de aceptación

- [ ] El esquema está en `schema.prisma` con su migración; `prisma/seed.js` es idempotente y las credenciales están en `.env` (con `dotenv`).
- [ ] `sort` y `order` se validan con lista blanca antes de usarse en `orderBy`.
- [ ] La paginación usa `skip`/`take` y el `total` respeta los mismos filtros que la consulta de datos.
- [ ] Todos los query params se validan (valores no numéricos o fuera de rango → `400`).
- [ ] Los filtros son combinables: cualquiera, todos o ninguno.
- [ ] Un libro creado con `POST` sigue existiendo después de reiniciar el servidor.
- [ ] Las funciones de `pagination.service.js` se reutilizan y no dependen de `req`/`res`.

---

## Ejercicio 5 — Encuestas en vivo ★★★★☆

**Objetivo:** modelar recursos con sub‑recursos, reglas de negocio con estado (encuestas abiertas/cerradas, votos únicos) y estado calculado a partir de la fecha de cierre. Los datos viven en memoria.

### Endpoints

- **`POST /polls`** → body `{ "question": "...", "options": ["A", "B", "C"], "durationMinutes": 10 }`.
  - `question` no vacía; entre 2 y 5 opciones, no vacías y sin repetir; `durationMinutes` entre 1 y 60.
  - El backend genera el `id` de la encuesta, un `id` para cada opción y calcula `closesAt`.
  - `201` con la encuesta creada.
- **`GET /polls`** → lista de encuestas con el campo calculado `status` (`OPEN` / `CLOSED`). Query param opcional `status`.
- **`GET /polls/:id`** → detalle con sus opciones (sin resultados).
- **`POST /polls/:id/votes`** → body `{ "studentCode": "20231234", "optionId": 2 }`.
  - `404` si la encuesta no existe; `400` si la opción no pertenece a la encuesta.
  - `409` si la encuesta está cerrada o si el alumno ya votó en ella.
  - `201` con `{ "message": "Voto registrado" }`.
- **`POST /polls/:id/close`** → cierra la encuesta antes de tiempo. `409` si ya estaba cerrada.
- **`GET /polls/:id/results`** → 

```json
{
  "pollId": 1,
  "status": "OPEN",
  "totalVotes": 25,
  "results": [ { "optionId": 1, "text": "A", "votes": 10, "percentage": 40 } ],
  "winner": null
}
```

  `winner` solo se informa cuando la encuesta está cerrada (en caso de empate, devuelve todas las opciones empatadas).

### Criterios de aceptación

- [ ] El estado `OPEN`/`CLOSED` se calcula en el backend a partir de `closesAt` y del cierre manual.
- [ ] Una encuesta cerrada (por tiempo o manualmente) rechaza nuevos votos con `409`.
- [ ] Un mismo `studentCode` no puede votar dos veces en la misma encuesta.
- [ ] Los porcentajes se redondean a 2 decimales; con 0 votos todos son `0` (sin dividir entre cero).
- [ ] Todos los errores `400`/`404`/`409` responden `{ "message": "..." }`.
- [ ] Flujo completo probado con Postman/curl: crear → votar → ver resultados → cerrar → ver ganador.

---

# PARTE B — Backend + Frontend (React + Vite + Tailwind CSS)

> Para cada ejercicio de esta parte, copie `frontend-base/` como se explica en *Configuración base del frontend*. La interfaz ya está construida: usted conecta y adapta los componentes de `src/exercises/exNN/`. Primero levante PostgreSQL (`docker compose up -d`), aplique las migraciones y el *seed* (`npx prisma migrate dev`, `npx prisma db seed`), deje funcionando y probado el backend (Postman/curl) y recién después construya la interfaz.

---

## Ejercicio 6 — Frases célebres ★★★☆☆

**Objetivo:** primer contacto entre frontend y backend: consumir endpoints `GET` con `fetch` dentro de `useEffect` y enviar query params desde la interfaz.

### Backend

- Modelo `Quote` en `schema.prisma`: `id` (`Int`, autoincremental), `text`, `author` y `category` (`String`). El *seed* carga **al menos 15 frases** (categorías: `motivación`, `tecnología`, `humor`) si la tabla está vacía.
- **`GET /quotes`** → lista de frases. Query params opcionales `author` y `category`.
- **`GET /quotes/random`** → una frase aleatoria (Prisma no tiene orden aleatorio: cuente con `count({ where })` y consulte con `skip: <índice al azar>, take: 1`). Query param opcional `category`. `404` si la categoría no tiene frases.
- **`GET /quotes/:id`** → una frase. `404` si no existe.
- **`GET /authors`** → arreglo de autores sin repetir, ordenado alfabéticamente (`findMany` con `distinct: ["author"]` y `orderBy`).

> ⚠️ Cuidado con el orden de las rutas: `/quotes/random` debe declararse **antes** que `/quotes/:id`.

### Frontend

**Componentes ya incluidos** en `src/exercises/ex06/` (modifíquelos, no los cree): `QuotesPage` (página con el estado y los `TODO`), `QuoteFilters` (selects de autor y categoría + botón "Frase aleatoria"), `FeaturedQuote` y `QuoteList` (ya maneja "Cargando..." y el mensaje de error).

**Lo que debe implementar** (en `QuotesPage.jsx`):

- Al cargar la página se obtienen las frases y los autores (`useEffect`).
- Al cambiar el autor o la categoría, se vuelve a consultar `GET /quotes` con los query params correspondientes.
- El botón **"Frase aleatoria"** pide `GET /quotes/random?category=...` y muestra el resultado en `FeaturedQuote`.
- Manejo de los estados `loading` y `error` que ya reciben los componentes.

### Criterios de aceptación

- [ ] El esquema está en `schema.prisma` con su migración, el *seed* es idempotente y las frases persisten al reiniciar el servidor.
- [ ] Las peticiones `GET` se hacen con `fetch` dentro de `useEffect`, con sus dependencias correctas (`[author, category]`) y verificando `response.ok`.
- [ ] Los query params se construyen con `URLSearchParams` (no concatenando cadenas a mano).
- [ ] El listado se actualiza al cambiar los filtros sin recargar la página.
- [ ] Se reutilizan los componentes existentes (`QuoteFilters`, `QuoteList`, `FeaturedQuote`): la página solo les pasa datos y funciones mediante `props`.

---

## Ejercicio 7 — Inscripción a talleres ★★★☆☆

**Objetivo:** enviar datos con `POST` desde un formulario, manejar errores de validación del backend y actualizar la interfaz con la respuesta.

### Backend

Modelos en `schema.prisma`:

- `Workshop`: `id`, `name`, `instructor`, `day` (un `enum Day { LUNES MARTES MIERCOLES JUEVES VIERNES }`), `capacity` (`Int`) y la relación `registrations Registration[]`. El *seed* carga al menos 6 talleres.
- `Registration`: `id`, `workshopId` (con la relación a `Workshop`), `studentCode`, `fullName`, `email`, `createdAt` (`DateTime @default(now())`) y la restricción `@@unique([workshopId, studentCode])`.

`availableSlots` se calcula a partir de `capacity` y del conteo de inscripciones (`include: { _count: { select: { registrations: true } } }`); el filtro `onlyAvailable` puede aplicarse sobre el resultado.

- **`GET /workshops`** → lista de talleres con el campo calculado `availableSlots` (no devolver las inscripciones). Query param opcional `day` (`LUNES` ... `VIERNES`) y `onlyAvailable=true`.
- **`GET /workshops/:id/registrations`** → inscripciones del taller. `404` si no existe.
- **`POST /workshops/:id/registrations`** → body `{ "studentCode": "20231234", "fullName": "Ana Torres", "email": "ana@aloe.ulima.edu.pe" }`.
  - `400`: campos vacíos, código que no tiene 8 dígitos o correo que no termina en `@aloe.ulima.edu.pe`.
  - `404`: taller inexistente.
  - `409`: taller sin vacantes, o el alumno ya está inscrito en ese taller, o el alumno ya está inscrito en otro taller **el mismo día**.
  - `201` con la inscripción creada y el número de vacantes restantes: `{ "registration": {...}, "availableSlots": 4 }`.

### Frontend

**Componentes ya incluidos** en `src/exercises/ex07/`: `WorkshopsPage` (estado y `TODO`), `WorkshopFilters`, `WorkshopCard` (se ve deshabilitada si no hay vacantes), `RegistrationForm` (formulario controlado desde la página; muestra errores y mensaje de éxito) y `RegistrationsList`.

**Lo que debe implementar** (en `WorkshopsPage.jsx`):

- Cargar los talleres con `GET /workshops` y volver a pedirlos al cambiar el día o "Solo con vacantes".
- "Inscribirme" abre el formulario del taller; al enviar, `POST /workshops/:id/registrations` con `Content-Type: application/json`.
- Si es exitoso: mostrar el mensaje de confirmación, limpiar el formulario y actualizar las vacantes **sin recargar la página**.
- Si falla: guardar `{ message, status }` y mostrarlo (el `ErrorMessage` distingue `400` y `409`).
- "Ver inscritos" pide `GET /workshops/:id/registrations` y llena la lista.

### Criterios de aceptación

- [ ] El formulario es controlado (`useState`) y se limpia tras una inscripción exitosa.
- [ ] El botón de envío se deshabilita mientras la petición está en curso.
- [ ] Se pasa el `status` del error a `ErrorMessage`, de modo que los errores `400` y `409` se distinguen visualmente.
- [ ] Las vacantes mostradas siempre coinciden con las del backend.
- [ ] Las inscripciones persisten al reiniciar el servidor y no se aceptan inscripciones en un taller sin vacantes.
- [ ] La relación `Workshop` ↔ `Registration` está definida en `schema.prisma` (con migración) y se consulta con `include`/`_count`.

---

## Ejercicio 8 — Recetario con porciones y calificaciones ★★★★☆

**Objetivo:** vistas de lista y detalle, cálculos en el backend parametrizados por query params, y `POST` sobre un sub‑recurso.

### Backend

Modelos en `schema.prisma`:

- `Recipe`: `id`, `title`, `minutes`, `baseServings` (`Int`), `steps` (`String[]`, arreglo nativo de PostgreSQL) y las relaciones `ingredients` y `ratings`.
- `RecipeIngredient`: `id`, `recipeId` (relación a `Recipe`), `name`, `quantity` (`Decimal @db.Decimal(10, 2)`), `unit`.
- `RecipeRating`: `id`, `recipeId` (relación a `Recipe`), `score` (`Int`), `comment` (`String?`, opcional) y `createdAt` (`DateTime @default(now())`). Prisma no tiene `CHECK`: valide `1 <= score <= 5` en el backend.

El *seed* carga al menos 5 recetas con sus ingredientes (puede usar *nested writes*: `create: { ..., ingredients: { create: [...] } }`). En la respuesta, cada receta expone `{ id, title, minutes, baseServings, ingredients: { name, quantity, unit }[], steps: string[], ratings }`.

- **`GET /recipes`** → lista resumida `{ id, title, minutes, averageRating, ratingCount }` (calcule los promedios con `recipeRating.groupBy({ by: ["recipeId"], _avg: { score: true }, _count: true })`; `averageRating` es `null` si no hay calificaciones, redondeado a 1 decimal en caso contrario). Query params opcionales: `search` (busca con `contains` + `mode: "insensitive"` en el título o en los nombres de ingredientes: `OR` con `ingredients: { some: { name: ... } }`) y `maxMinutes`.
- **`GET /recipes/:id`** → detalle completo (incluye `averageRating` y `ratingCount`). Query param opcional `servings` (entero entre 1 y 20): el backend **escala las cantidades** de los ingredientes proporcionalmente a `servings / baseServings` (redondeo a 2 decimales). `400` si `servings` es inválido; `404` si la receta no existe.
- **`POST /recipes/:id/ratings`** → body `{ "score": 4, "comment": "Muy rica" }`. `score` entero de 1 a 5; `comment` opcional de máximo 200 caracteres. Retorna `201` con `{ averageRating, ratingCount }` actualizados.
- **`GET /recipes/:id/ratings`** → calificaciones ordenadas de la más reciente a la más antigua. Query param opcional `minScore`.

### Frontend

**Componentes ya incluidos** en `src/exercises/ex08/`: `RecipesPage` (estado y `TODO`), `RecipeSearch`, `RecipeList`, `RecipeDetail` (con el input de porciones), `RatingForm` (estrellas 1–5 y comentario) y `RatingsList` (con filtro de mínimo de estrellas).

**Lo que debe implementar** (en `RecipesPage.jsx`):

- Lista de recetas con `GET /recipes` y los filtros de búsqueda y tiempo máximo.
- Al seleccionar una receta se guarda su `id` en el estado y se pide su detalle.
- Al cambiar las porciones se vuelve a pedir `GET /recipes/:id?servings=N` y se actualizan las cantidades (el cálculo lo hace el backend).
- Enviar la calificación con `POST /recipes/:id/ratings`; después se actualiza el promedio en el detalle **y** en la lista.
- Los comentarios con `GET /recipes/:id/ratings?minScore=...`.

### Criterios de aceptación

- [ ] El escalado de cantidades se hace en el backend, no en el frontend.
- [ ] Las calificaciones persisten al reiniciar; el promedio y el conteo se calculan con `aggregate`/`groupBy` de Prisma.
- [ ] El detalle de la receta junta los tres modelos con `include`; la estructura está solo en `schema.prisma` (con migración).
- [ ] `useEffect` tiene correctamente declaradas sus dependencias (`id`, `servings`).
- [ ] Se evita que una respuesta antigua sobrescriba a una más reciente al cambiar rápido las porciones (por ejemplo con `AbortController` o una bandera `ignore`).
- [ ] Los datos de ejemplo de `sample.js` fueron reemplazados por los que devuelve el backend, y los componentes siguen mostrando lista, detalle y calificaciones sin errores.

---

## Ejercicio 9 — Cotizador de pedidos ★★★★★

**Objetivo:** enviar payloads anidados (arreglos de objetos), centralizar reglas de cálculo en el backend y manejar en el frontend un estado complejo (carrito) con `useReducer`.

### Backend

**Modelos en `schema.prisma`:**

- `MenuItem`: `id`, `name`, `category`, `price` (`Decimal @db.Decimal(8, 2)`, soles), `available` (`Boolean`).
- `Coupon`: `code` (`String @id`), `type` (`enum CouponType { PERCENT FIXED }`), `value`, `minSubtotal` (`Decimal`), `expiresAt` (`DateTime`).
- `District`: `name` (`String @id`), `fee` (`Decimal`).
- `Order`: `id`, `code` (`String @unique`), `customerName`, `phone`, `district`, `couponCode` (`String?`), `currency`, `subtotal`, `couponDiscount`, `volumeDiscount`, `delivery`, `total` (`Decimal`), `status` (`String @default("RECEIVED")`), `createdAt` y la relación `items OrderItem[]`.
- `OrderItem`: `id`, `orderId` (relación a `Order`), `productId`, `name`, `unitPrice`, `quantity`, `lineTotal` (se guarda el nombre y el precio **al momento del pedido**).

El *seed* carga datos iniciales de menú (al menos 10 platos en 3 categorías), cupones (alguno vencido) y distritos.

**Constante en el código:** tipo de cambio fijo `1 USD = 3.75 PEN`.

**Endpoints:**

- **`GET /menu`** → platos `{ id, name, category, price, available }` (con `price` como número). Query params opcionales `category` y `onlyAvailable=true`.
- **`GET /districts`** → arreglo con los nombres de los distritos con delivery disponible (ej. `["Surco", "Miraflores"]`).
- **`POST /quotes?currency=PEN|USD`** → *query param + payload anidado*. No guarda nada, solo calcula.

```json
{
  "items": [ { "productId": 1, "quantity": 2 }, { "productId": 5, "quantity": 1 } ],
  "couponCode": "ULIMA10",
  "district": "Surco"
}
```

Reglas de cálculo (en este orden):

1. `subtotal` = Σ (precio × cantidad).
2. Descuento por cupón (si es válido, no ha vencido y `subtotal >= minSubtotal`). Un cupón inválido **no** produce error: se informa en `warnings` y no se aplica.
3. Descuento por volumen: 5 % adicional si hay 10 o más unidades en total.
4. `delivery` según el distrito (gratis si el total con descuentos supera S/ 150).
5. Conversión a la moneda solicitada, redondeando a 2 decimales.

Respuesta `200`:

```json
{
  "currency": "PEN",
  "lines": [ { "productId": 1, "name": "Lomo saltado", "unitPrice": 28, "quantity": 2, "lineTotal": 56 } ],
  "subtotal": 74.0,
  "couponDiscount": 7.4,
  "volumeDiscount": 0,
  "delivery": 8.0,
  "total": 74.6,
  "warnings": []
}
```

  - `400` si `items` está vacío, alguna cantidad no es entero positivo, un producto se repite o no existe, el producto no está disponible, el distrito no existe o la moneda es inválida.

- **`POST /orders`** → mismo body que la cotización más `customer: { name, phone }`. Recalcula todo (nunca confía en totales enviados por el cliente), guarda el pedido y sus líneas con una **escritura anidada** (`order.create({ data: { ..., items: { create: [...] } } })`, que Prisma ejecuta de forma atómica), con un código generado a partir del `id` (ej. `PED-0001`, se asigna con un `update` después de crear el pedido) y estado `RECEIVED`. Retorna `201` con el pedido (`code`, `status`, `currency`, `total`, ... y sus líneas).
- **`GET /orders/:code`** → mismo formato de pedido, con sus líneas (`include: { items: true }`). `404` si no existe.
- **`GET /customers/:phone/orders`** → arreglo de pedidos del cliente (`code`, `status`, `currency`, `total`), query param opcional `status`.

### Frontend

**Componentes ya incluidos** en `src/exercises/ex09/`: `OrderPage` (estado y `TODO`), `MenuList` (agrupado por categoría), `Cart`, `CheckoutOptions` (distrito, cupón, moneda y advertencias), `QuoteSummary`, `ConfirmOrder`, `OrderLookup` ("Consultar pedido") y `MyOrders` ("Mis pedidos"). El archivo `cartReducer.js` es un esqueleto que usted completa.

**Lo que debe implementar** (en `OrderPage.jsx` y `cartReducer.js`):

- Cargar el menú y los distritos (`GET /menu`, `GET /districts`).
- Carrito con `useReducer` (acciones: `ADD_ITEM`, `REMOVE_ITEM`, `SET_QUANTITY`, `CLEAR`).
- Cada vez que cambia el carrito, el cupón, el distrito o la moneda, solicitar una nueva cotización (`POST /quotes`) y mostrarla en `QuoteSummary`. Las advertencias (`warnings`) se muestran junto al cupón.
- "Confirmar pedido" envía `POST /orders` y muestra el código generado.
- "Consultar pedido" por código y "Mis pedidos" por teléfono.

### Criterios de aceptación

- [ ] El frontend **no** calcula totales; solo muestra los valores devueltos por el backend.
- [ ] Las reglas de cálculo están en `quote.service.js` y son reutilizadas por `POST /quotes` y `POST /orders`.
- [ ] Si falla el guardado de alguna línea, no queda un pedido incompleto en la base (escritura anidada).
- [ ] Los pedidos persisten al reiniciar y `GET /customers/:phone/orders` los recupera.
- [ ] Los importes `Decimal` se convierten a número y se redondean a 2 decimales antes de responder.
- [ ] `cartReducer.js` es una función pura que no muta el estado y maneja cada acción (`type`) con un `switch`.
- [ ] Los errores de validación del backend se muestran sin perder el contenido del carrito.

---

## Ejercicio 10 — Reserva de salas de estudio (integrador) ★★★★★

**Objetivo:** integrar todo lo trabajado: path params, query params, payloads, reglas de negocio con fechas, transiciones de estado vía `POST`, manejo centralizado de errores y un frontend con varias vistas.

### Backend

**Modelos en `schema.prisma`:**

- `Room`: `id`, `name`, `building`, `capacity`, `hasProjector` (`Boolean`), `hasWhiteboard` (`Boolean`) y la relación `reservations`. El *seed* carga al menos 8 salas en 2 o 3 edificios.
- `Reservation`: `id`, `code` (`String @unique`, ej. `RSV-2026-0001`, generado a partir del `id` con un `update` después de crear la reserva), `roomId` (relación a `Room`), `studentCode`, `date` (`DateTime @db.Date`), `startHour`, `endHour`, `hours`, `attendees` (`Int`), `status` (`enum ReservationStatus { ACTIVE CANCELLED }`) y `createdAt`. Agregue `@@index([roomId, date])`.
- Horario de atención (constante en el código): de 08:00 a 22:00 (bloques de una hora).

> Prisma no permite comparar `startHour + hours` dentro de un `where`; por eso se guarda también `endHour = startHour + hours`. Dos reservas `[a, e1)` y `[b, e2)` se cruzan si `a < e2 AND b < e1`; en Prisma: `where: { startHour: { lt: nuevoFin }, endHour: { gt: nuevoInicio }, status: "ACTIVE", ... }`.

**Organización requerida:**

```
prisma/schema.prisma              # modelos (fuente de verdad), migraciones y seed.js
src/prisma.js                     # cliente de Prisma
src/errors/AppError.js            # class AppError extends Error { statusCode }
src/middlewares/errorHandler.js   # middleware de errores (4 parámetros) que responde { message }
src/services/rooms.service.js
src/services/reservations.service.js
src/index.js                      # define todas las rutas (rooms, reservations, students)
```

Los servicios lanzan `AppError` y los handlers de las rutas **no** construyen respuestas de error manualmente: el `errorHandler` centraliza la respuesta.

**Endpoints:**

- **`GET /rooms`** → query params opcionales `building`, `minCapacity`, `projector=true`, `whiteboard=true`.
- **`GET /rooms/:id/availability?date=YYYY-MM-DD`** → *path + query obligatorio*.

```json
{ "roomId": 3, "date": "2026-11-20", "slots": [ { "hour": 8, "available": true }, { "hour": 9, "available": false } ] }
```

  `400` si la fecha no tiene el formato correcto o es pasada.

- **`POST /rooms/:id/reservations`** → body `{ "studentCode": "20231234", "date": "2026-11-20", "startHour": 10, "hours": 2, "attendees": 4 }`.
  - `400`: `hours` entre 1 y 3; la reserva debe empezar y terminar dentro del horario de atención; fecha no pasada y como máximo 7 días en el futuro; `attendees` entre 1 y la capacidad de la sala.
  - `409`: se cruza con otra reserva **activa** de la misma sala; o el alumno ya tiene otra reserva activa que se cruza en horario (en cualquier sala); o el alumno ya reservó 4 horas o más ese día.
  - `201` con la reserva y un código generado (ej. `RSV-2026-0001`).
- **`GET /reservations/:code`** → detalle de la reserva con los datos de la sala.
- **`POST /reservations/:code/cancel`** → body `{ "studentCode": "20231234" }`.
  - `404` si no existe; `400` si el `studentCode` no coincide con el de la reserva; `409` si ya estaba cancelada o si faltan menos de 2 horas para su inicio.
  - `200` con la reserva en estado `CANCELLED`.
- **`GET /students/:studentCode/reservations`** → arreglo de reservas (`code`, `roomId`, `date`, `startHour`, `hours`, `attendees`, `status`), con query params opcionales `status` (`ACTIVE` / `CANCELLED`) y `upcoming=true` (solo reservas futuras). Ordenado por fecha y hora ascendente.

### Frontend

Tres vistas, navegables mediante las pestañas (`Tabs`) que ya trae `RoomsPage` (estado `view`).

**Componentes ya incluidos** en `src/exercises/ex10/`: `RoomsPage` (estado y `TODO`), `RoomFilters`, `RoomList`, `AvailabilityGrid` (bloques de una hora entre las 08:00 y las 22:00, el último empieza a las 21:00; los ocupados se ven en gris), `ReservationForm`, `MyReservationsFilters` y `ReservationList` (con el botón "Cancelar" en las reservas activas). Para los errores se usa el `ErrorMessage` del kit `src/components/ui/`.

**Lo que debe implementar** (en `RoomsPage.jsx` y `src/hooks/useFetch.js`):

1. **Buscar sala:** pedir `GET /rooms` con los filtros; al elegir sala y fecha, pedir `GET /rooms/:id/availability?date=...`. Seleccionar bloques **consecutivos** en la grilla rellena `startHour` y `hours` del formulario.
2. **Reservar:** validaciones básicas en el cliente (campos requeridos, rango de horas) **además** de las del backend; `POST /rooms/:id/reservations`. Tras reservar, mostrar el código y actualizar la grilla.
3. **Mis reservas:** `GET /students/:studentCode/reservations` con los filtros (`status`, `upcoming`). "Cancelar" pide confirmación (`window.confirm`) y llama a `POST /reservations/:code/cancel`; luego se recarga la lista.

Requisito adicional: escribir el *custom hook* reutilizable `useFetch(path)` (si `path` es `null`, no hace la petición) que devuelva `{ data, loading, error, reload }` y usarlo en al menos dos vistas.

### Criterios de aceptación

- [ ] La detección de cruces de horario funciona para todos los casos (inicio dentro, fin dentro, reserva que contiene a otra), resuelta con una consulta de Prisma sobre `startHour`/`endHour`.
- [ ] No se puede confirmar una reserva que se cruza con otra reserva activa de la misma sala.
- [ ] El esquema está solo en `schema.prisma` (con migraciones), las reservas persisten al reiniciar el servidor y `date` se devuelve como `YYYY-MM-DD`.
- [ ] Las reservas canceladas no bloquean la disponibilidad.
- [ ] El manejo de errores está centralizado en el backend (`AppError` + `errorHandler`).
- [ ] Solo se usan `GET` y `POST`; la cancelación es una transición de estado mediante `POST`.
- [ ] `useFetch` (en `src/hooks/useFetch.js`) está implementado, cancela/ignora respuestas antiguas y se reutiliza en al menos dos vistas.
- [ ] La aplicación completa funciona de extremo a extremo: buscar → reservar → ver en "Mis reservas" → cancelar → la sala vuelve a estar disponible.

---

## Recomendaciones para probar el backend

Si el ejercicio usa base de datos, verifique también los datos con `npx prisma studio` (interfaz web para ver las tablas).

Antes de conectar el frontend, pruebe cada endpoint con una herramienta como **Postman**, **Thunder Client** (extensión de VS Code) o `curl`:

```bash
# GET con path param y query param
curl "http://localhost:3000/greetings/Ana?lang=en"

# POST con payload JSON
curl -X POST http://localhost:3000/tools/bmi \
  -H "Content-Type: application/json" \
  -d '{"weight": 70, "height": 1.75}'
```
