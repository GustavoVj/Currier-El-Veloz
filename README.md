# La Veloz - Sistema de Gestión Logística

Sistema integral de logística y courier diseñado para gestionar encomiendas, tarificación dinámica, control de estados de despacho mediante máquina de estados, módulo de caja y auditoría de trazabilidad completa.

## Tecnologías Utilizadas

**Frontend:**
- React (con Vite)
- TypeScript
- React Router Dom (Navegación y Rutas Protegidas)
- Lucide React (Iconografía)
- Axios (Cliente HTTP)

**Backend:**
- Node.js
- Express.js
- TypeScript
- MySQL (con el driver `mysql2/promise`)

---

## Requisitos Previos

Antes de clonar el proyecto, asegúrate de tener instalado en tu computadora:
1. **Node.js** (v18 o superior)
2. **MySQL** (Servidor local usando XAMPP, WAMP o MySQL Server nativo)
3. **Git**

---

## Configuración del Entorno Local (Paso a Paso)

Sigue estos pasos para levantar el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/TU-USUARIO/la-veloz-logistica.git](https://github.com/TU-USUARIO/la-veloz-logistica.git)
cd la-veloz-logistica

2. Configurar la Base de Datos (MySQL)
  1.Abre tu gestor de base de datos preferido (ej. phpMyAdmin, MySQL Workbench o DBeaver).
  2. Crea una base de datos vacía llamada bd_laveloz.
  3. Solicita al administrador del repositorio el script SQL inicial (database.sql) o localízalo en la carpeta del backend.
  4. Ejecuta el script para construir las tablas e insertar los catálogos base, tarifas y usuarios de prueba.

3. Levantar el Backend (Servidor Node.js)
Abre una terminal y navega a la carpeta del backend:
Bash
cd backend
Instala las dependencias:
Bash
npm install
Crea un archivo .env en la raíz de la carpeta backend con las siguientes variables (ajusta el usuario y contraseña según tu configuración local de MySQL):Fragmento de códigoPORT=3001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bd_laveloz

Inicia el servidor en modo desarrollo:
Bash
npm run dev
(El servidor debería arrancar y mostrar: "Servidor corriendo en puerto 3001" y "Conectado a MySQL").

4. Levantar el Frontend (Cliente React)
Abre una nueva terminal (manteniendo el backend corriendo) y navega a la carpeta del frontend:
Bash
cd frontend
Instala las dependencias:
Bash
npm install
Inicia la aplicación con Vite:
Bash
npm run dev
(El sistema estará disponible en tu navegador, generalmente en http://localhost:5173).

Usuarios de Prueba y Roles (RBAC)
El sistema cuenta con un Control de Acceso Basado en Roles (RBAC). Según el usuario con el que ingreses, tendrás acceso a distintos módulos.
Puedes utilizar las siguientes credenciales de prueba tras cargar la base de datos inicial:
Usuario    Contraseña    Rol en el Sistema
gvaca      12345         Administrador (Acceso total, Tarifas y Auditoría)
jvargas    12345         Recepcionista (Clientes, Recepción y Tarificación)
jsalinas   12345         Despachante (Control de Estados y Trazabilidad)

(Nota: Ajustar las contraseñas si el entorno local usa encriptación bcrypt real).

Historias de Usuario (HU) Implementadas
HU1: Landing Page Institucional.
HU2: Login y Seguridad por Roles (JWT/RBAC).
HU3: Matriz Dinámica de Tarifas y Rutas.
HU4: Gestión Integral de Clientes (Remitentes/Destinatarios).
HU5: Recepción y Emisión de Guías de Envío.
HU6: Máquina de Estados Logísticos (Tracking).
HU7: Módulo de Caja y Consolidación Financiera.
HU8: Trazabilidad Global y Reportes de Auditoría.
