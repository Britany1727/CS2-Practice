// Importaciones y configuraciones
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './database.js';
// Rutas de modelos
import usuarioRoutes from './routers/usuario_routes.js'
import clienteRoutes from './routers/cliente_routes.js'
import vehiculoRoutes from './routers/vehiculo_routes.js'
import reservaRoutes from './routers/reserva_routes.js'

// 1. Inicializaciones
const app = express();
dotenv.config();
connection(); 

// 2. Configuraciones
app.set('port', process.env.PORT || 3000);
app.use(cors()); 
app.use(express.json());

// 3. Rutas
// Ruta de prueba
app.get('/', (req, res) => res.send("¡El servidor de CarroRenta está vivo!"))
// Rutas de modelos
app.use('/api', usuarioRoutes)
app.use('/api', clienteRoutes)
app.use('/api', vehiculoRoutes)
app.use('/api', reservaRoutes)

// 4. Iniciar
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});