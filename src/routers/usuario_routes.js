import {Router} from 'express'
import { login, registro } from '../controllers/usuario_controller.js'

const router = Router()

// Rutas Públicas (No requieren token)
router.post('/login', login)
router.post('/registro', registro)

export default router