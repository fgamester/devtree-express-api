import mongoose from 'mongoose'
import colors from 'colors'

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI)
        const apiURL = `${connection.host}:${connection.port}`
        console.log(colors.cyan('Connection to MongoDB successfully...'))
    } catch (error) { 
        console.log(colors.bgRed.black.bold(error.message))
    }
}