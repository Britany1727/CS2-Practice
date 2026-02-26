import {Router} from 'express'
import { 
    registrarVehiculo, 
    listarVehiculos, 
    detalleVehiculo, 
    actualizarVehiculo, 
    eliminarVehiculo 
} from '../controllers/vehiculo_controller.js'
import verificarAutenticacion from '../middlewares/auth.js'

const router = Router()

// Rutas Públicas 
router.get('/vehiculos', listarVehiculos)
router.get('/vehiculo/:id', detalleVehiculo)

// Rutas Privadas (Solo el empleado con Token puede modificar)
router.post('/vehiculos', verificarAutenticacion, registrarVehiculo)
router.put('/vehiculo/:id', verificarAutenticacion, actualizarVehiculo)
router.delete('/vehiculo/:id', verificarAutenticacion, eliminarVehiculo)

export default router