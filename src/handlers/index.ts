import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { hashPassword } from "../utils/auth"
import slug from 'slug'
import User from "../models/User"

/* json response template
resp.status(200).json({
    status: "status",
    message: "message"
})
*/
export const createAccount = async (req: Request, resp: Response) => {
    const { email, name, password } = req.body

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        resp.status(400).json({
            errors: errors.array()
        })
        console.log(errors)
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