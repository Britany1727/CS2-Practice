import {Router} from 'express'
import { 
    registrarReserva, 
    listarReservas, 
    detalleReserva, 
    actualizarReserva, 
    eliminarReserva 
} from '../controllers/reserva_controller.js'
import verificarAutenticacion from '../middlewares/auth.js'

const router = Router()

// Todas las rutas son Privadas
router.post('/reservas', verificarAutenticacion, registrarReserva)
router.get('/reservas', verificarAutenticacion, listarReservas)
router.get('/reserva/:id', verificarAutenticacion, detalleReserva)
router.put('/reserva/:id', verificarAutenticacion, actualizarReserva)
router.delete('/reserva/:id', verificarAutenticacion, eliminarReserva)

export default router