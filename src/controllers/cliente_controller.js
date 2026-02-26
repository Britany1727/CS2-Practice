import Cliente from '../models/Cliente.js'
import mongoose from 'mongoose'

// 1. REGISTRAR CLIENTE
const registrarCliente = async (req, res) => {
    try {
        const { nombre, apellido, cedula, email, fecha_nacimiento, telefono, direccion } = req.body
        
        // Validar campos obligatorios (según tu Modelo)
        if (Object.values({nombre, apellido, cedula, email, fecha_nacimiento}).includes("")) 
            return res.status(400).json({msg: "Lo sentimos, debes llenar los campos obligatorios"})
        
        // Validar Cédula duplicada
        const verificarCedula = await Cliente.findOne({cedula})
        if(verificarCedula) 
            return res.status(400).json({msg: "Lo sentimos, la cédula ya se encuentra registrada"})

        // Validar Email duplicado
        const verificarEmail = await Cliente.findOne({email})
        if(verificarEmail) 
            return res.status(400).json({msg: "Lo sentimos, el email ya se encuentra registrado"})

        const nuevoCliente = new Cliente(req.body)
        await nuevoCliente.save()
        
        res.status(200).json({msg: "Cliente registrado exitosamente"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Error en el servidor", error: error.message})
    }
}

// 2. LISTAR CLIENTES
const listarClientes = async (req, res) => {
    try {
        // .find() trae todo. .sort() los ordena por fecha de creación (opcional)
        const clientes = await Cliente.find().sort({createdAt: -1})
        res.status(200).json(clientes)
    } catch (error) {
        res.status(500).json({msg: "Error al listar clientes", error: error.message})
    }
}

// 3. DETALLE DE UN CLIENTE
const detalleCliente = async (req, res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: "ID no válido"})

    const cliente = await Cliente.findById(id)
    if(!cliente) return res.status(404).json({msg: "Cliente no encontrado"})

    res.status(200).json(cliente)
}

// 4. ACTUALIZAR CLIENTE
const actualizarCliente = async (req, res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: "ID no válido"})

    // Si intentan cambiar la cédula, verificar que no pertenezca a otro
    if(req.body.cedula){
        const verificarCedula = await Cliente.findOne({cedula: req.body.cedula})
        if(verificarCedula && verificarCedula._id.toString() !== id)
            return res.status(400).json({msg: "La cédula ya pertenece a otro cliente"})
    }

    // Si intentan cambiar el email, verificar que no pertenezca a otro
    if(req.body.email){
        const verificarEmail = await Cliente.findOne({email: req.body.email})
        if(verificarEmail && verificarEmail._id.toString() !== id)
            return res.status(400).json({msg: "El email ya pertenece a otro cliente"})
    }

    await Cliente.findByIdAndUpdate(id, req.body)
    res.status(200).json({msg: "Cliente actualizado exitosamente"})
}

// 5. ELIMINAR CLIENTE
const eliminarCliente = async (req, res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: "ID no válido"})

    await Cliente.findByIdAndDelete(id)
    res.status(200).json({msg: "Cliente eliminado exitosamente"})
}

export {
    registrarCliente,
    listarClientes,
    detalleCliente,
    actualizarCliente,
    eliminarCliente
}