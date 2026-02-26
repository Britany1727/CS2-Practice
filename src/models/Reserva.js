import mongoose, {Schema, model} from 'mongoose'

const reservaSchema = new Schema({
    codigo: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    // CONEXIÓN 1: Quién renta
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    // CONEXIÓN 2: Qué carro se lleva
    vehiculo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehiculo',
        required: true
    },
    dias_renta: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        trim: true
    }
},{
    timestamps: true
})

export default model('Reserva', reservaSchema)