import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        console.log(origin)
        if (origin === 'http://localhost:5173' || origin == null) {
            callback(null, true)
        } else {
            callback(new Error(`Request from ${origin} blocked by CORS`))
        }
    }
}