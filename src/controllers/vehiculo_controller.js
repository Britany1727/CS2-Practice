import Vehiculo from '../models/Vehiculo.js'
import mongoose from 'mongoose'

// 1. REGISTRAR VEHÍCULO
const registrarVehiculo = async (req, res) => {
    try {
        const { placa, marca, modelo, anio, precio_dia } = req.body
        
        // Validar campos vacíos
        if (Object.values({placa, marca, modelo, anio, precio_dia}).includes("")) 
            return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos obligatorios"})
        
        // Validar que la placa no exista
        const verificarPlaca = await Vehiculo.findOne({placa})
        if(verificarPlaca) 
            return res.status(400).json({msg: "La placa del vehículo ya se encuentra registrada"})

        const nuevoVehiculo = new Vehiculo(req.body)
        await nuevoVehiculo.save()
        
        res.status(200).json({msg: "Vehículo registrado exitosamente"})
    } catch (error) {
        res.status(500).json({msg: "Error en el servidor", error: error.message})
    }
}

// 2. LISTAR VEHÍCULOS
const listarVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find().sort({createdAt: -1})
        res.status(200).json(vehiculos)
    } catch (error) {
        res.status(500).json({msg: "Error al listar vehículos", error: error.message})
    }
}

// 3. DETALLE DE UN VEHÍCULO
const detalleVehiculo = async (req, res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: "ID no válido"})

    const vehiculo = await Vehiculo.findById(id)
    if(!vehiculo) return res.status(404).json({msg: "Vehículo no encontrado"})

    res.status(200).json(vehiculo)
}

// 4. ACTUALIZAR VEHÍCULO
const actualizarVehiculo = async (req, res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: "ID no válido"})

    // Si intentan cambiar la placa, verificar que no pertenezca a otro carro
    if(req.body.placa){
        const verificarPlaca = await Vehiculo.findOne({placa: req.body.placa})
        if(verificarPlaca && verificarPlaca._id.toString() !== id)
            return res.status(400).json({msg: "Esta placa ya pertenece a otro vehículo registrado"})
    }

    await Vehiculo.findByIdAndUpdate(id, req.body)
    res.status(200).json({msg: "Vehículo actualizado exitosamente"})
}

// 5. ELIMINAR VEHÍCULO
const eliminarVehiculo = async (req, res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: "ID no válido"})

    await Vehiculo.findByIdAndDelete(id)
    res.status(200).json({msg: "Vehículo eliminado exitosamente"})
}

export {
    registrarVehiculo,
    listarVehiculos,
    detalleVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
}