import Reserva from '../models/Reserva.js'
import Cliente from '../models/Cliente.js'
import Vehiculo from '../models/Vehiculo.js'
import mongoose from 'mongoose'

// 1. REGISTRAR RESERVA
const registrarReserva = async (req, res) => {
    try {
        const { codigo, cliente, vehiculo, dias_renta, descripcion } = req.body
        
        // Validar campos vacíos
        if (Object.values({codigo, cliente, vehiculo, dias_renta}).includes("")) 
            return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos obligatorios"})
        
        // Validar que el Código no exista
        const verificarCodigo = await Reserva.findOne({codigo})
        if(verificarCodigo) 
            return res.status(400).json({msg: "El código de la reserva ya existe"})

        // VALIDACIÓN DE INTEGRIDAD Y DISPONIBILIDAD
        // 1. Verificar que el Cliente exista
        const clienteExiste = await Cliente.findById(cliente)
        if(!clienteExiste) return res.status(404).json({msg: "El cliente asignado no existe"})

        // 2. Verificar que el Vehículo exista
        const vehiculoExiste = await Vehiculo.findById(vehiculo)
        if(!vehiculoExiste) return res.status(404).json({msg: "El vehículo asignado no existe"})

        // 3. (Opcional pero recomendado) Verificar si está disponible
        if(!vehiculoExiste.estado) {
            return res.status(400).json({msg: "El vehículo seleccionado no está disponible actualmente"})
        }

        // Guardar Reserva
        const nuevaReserva = new Reserva(req.body)
        await nuevaReserva.save()
        
        // Opcional: Cambiar el estado del vehículo a "rentado" (false)
        vehiculoExiste.estado = false
        await vehiculoExiste.save()
        
        res.status(200).json({msg: "Reserva registrada exitosamente"})

    } catch (error) {
        res.status(500).json({msg: "Error en el servidor", error: error.message})
    }
}

// 2. LISTAR RESERVAS (Con datos completos)
const listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate('cliente', 'nombre apellido cedula telefono') // Datos del cliente
            .populate('vehiculo', 'marca modelo placa precio_dia')  // Datos del carro
        
        res.status(200).json(reservas)
    } catch (error) {
        res.status(500).json({msg: "Error al listar reservas", error: error.message})
    }
}

// 3. DETALLE DE RESERVA
const detalleReserva = async (req, res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: "ID no válido"})

    const reserva = await Reserva.findById(id)
        .populate('cliente', 'nombre apellido cedula telefono')
        .populate('vehiculo', 'marca modelo placa precio_dia')

    if(!reserva) return res.status(404).json({msg: "Reserva no encontrada"})

    res.status(200).json(reserva)
}

// 4. ACTUALIZAR RESERVA
const actualizarReserva = async (req, res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: "ID no válido"})

    await Reserva.findByIdAndUpdate(id, req.body)
    res.status(200).json({msg: "Reserva actualizada exitosamente"})
}

// 5. ELIMINAR RESERVA
const eliminarReserva = async (req, res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: "ID no válido"})

    // Opcional: Al eliminar la reserva, volver a poner el carro como disponible (true)
    const reserva = await Reserva.findById(id)
    if(reserva) {
        await Vehiculo.findByIdAndUpdate(reserva.vehiculo, {estado: true})
        await Reserva.findByIdAndDelete(id)
        res.status(200).json({msg: "Reserva eliminada exitosamente"})
    } else {
        res.status(404).json({msg: "Reserva no encontrada"})
    }
}

export {
    registrarReserva,
    listarReservas,
    detalleReserva,
    actualizarReserva,
    eliminarReserva
}