import { Request, Response } from "express";
import { validationResult } from "express-validator";
import colors from 'colors';
import { hashPassword } from "../utils/auth";
import slug from 'slug';
import User from "../models/User";

/* json response template
resp.status(200).json({
    status: "status",
    message: "message"
})
*/

interface CustomError {
    value: string | number,
    msg: string,
    param?: string,
    location?: string
}

export const createAccount = async (req: Request, resp: Response) => {
    const { email, handle, password } = req.body;
    const sluggedHandle = slug(handle);

    // These variables will contain the request errors
    const badRequestErrors = validationResult(req);
    const conflictErrors: CustomError[] = [];

    // Validate if the request has errors and respond with a 400 status if it does
    if (!badRequestErrors.isEmpty()) {
        resp.status(400).json({
            errors: badRequestErrors.array().map(error => error.msg)
        });
        console.log(badRequestErrors);
        return;
    }

    // Available validations
    const emailExists = await User.findOne({ email: email })
    if (emailExists) {
        conflictErrors.push({
            value: email,
            msg: "Email is already in use",
            param: 'email',
            location: 'body'
        });
    }
    const handleExists = await User.findOne({ handle: sluggedHandle })
    if (handleExists) {
        conflictErrors.push({
            value: handle,
            msg: "Handle is already taken",
            param: 'handle',
            location: 'body'
        });
    }

    if (conflictErrors.length > 0) {
        resp.status(409).json({
            errors: conflictErrors.map(error => error.msg)
        })
        console.log(conflictErrors);
        return;
    }

    // If all it's good, the record will be created in the data base
    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = sluggedHandle;
    user.save();

    resp.status(201).json({
        status: "success",
        msg: "Registration successful"
    });
    console.log({
        msg: 'User created',
        user: user
    })
}

export const login = async (req: Request, resp: Response) => {
    const { email, password } = req.body;

    const badRequestErrors = validationResult(req);
    const unauthorizedErrors: CustomError[] = [];

    if (!badRequestErrors.isEmpty()) {
        resp.status(400).json({
            errors: badRequestErrors.array().map(error => error.msg)
        });
        console.log(badRequestErrors);
        return;
    }
    // Unauthorized errors handling
    const emailExists = User.findOne({ email: email });

    if (emailExists) {
        unauthorizedErrors.push({
            value: email,
            msg: "Email doesn't match with any user",
            param: 'email',
            location: 'body'
        });
    }

    if (unauthorizedErrors.length > 0) {
        resp.status(401).json({
            error: "The credentials are incorrect"
        });
        console.log(unauthorizedErrors);
        return;
    }
}