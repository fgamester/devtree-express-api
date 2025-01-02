import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI)
        const apiURL = `${connection.host}:${connection.port}`
        console.log('Connection to MongoDB successfully...')
    } catch (error) {
        console.log(error.message)
    }
}