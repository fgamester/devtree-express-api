import mongoose, { Schema } from 'mongoose'

// Declare the TS interface that our model Users will have
interface IUser {
    name: string
    email: string
    password: string
    handle: string
}

// Create the schema that our Users DB will have
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    handle:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    }
})

// Se declara User como un modelo con la respectiva función de mongoose
// entre angle brackets proveemos el interface User
// recibe como argumento el nombre que tendrá el modelo y el esquema previamente creado
const User = mongoose.model<IUser>('User', userSchema)
export default User