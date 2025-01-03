import { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"

/* json response template
resp.status(200).json({
    status: "status",
    message: "message"
})
*/
export const createAccount = async (req: Request, resp: Response) => {
    const { email, name, password } = req.body

    // Fields validation
    if (!email) {
        resp.status(400).json({
            status: "error",
            message: "Email is required"
        })
        return;
    } else if (!name) {
        resp.status(400).json({
            status: "error",
            message: "Name is required"
        })
        return;
    } else if (!password) {
        resp.status(400).json({
            status: "error",
            message: "Password is required"
        })
        return;
    }

    // Duplicated validation
    const userExists = await User.findOne({ email })
    if (userExists) {
        resp.status(409).json({
            status: "error",
            message: "Email is already taken"
        })
        return;
    }

    // If all's good, the record will be created in the data base
    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.save()

    resp.status(201).json({
        status: "success",
        message: "Registration successful"
    })
}