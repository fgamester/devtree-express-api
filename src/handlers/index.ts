import { Request, Response } from "express";
import { validationResult } from "express-validator";
import colors from 'colors';
import { hashPassword, checkPassword } from "../utils/auth";
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
};

export const createAccount = async (req: Request, resp: Response) => {
    const { email, handle, password } = req.body;
    const sluggedHandle = slug(handle); // Slug the handle to make it URL-friendly

    // These variables will contain the request errors
    const conflictErrors: CustomError[] = [];

    // Availability validations
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

    // Respond with a 409 status code if some unique field is taken
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
    });
};

export const login = async (req: Request, resp: Response) => {
    const { email, password } = req.body;
    console.log('trying login...')

    const unauthorizedErrors: CustomError[] = [];

    // Unauthorized errors handling
    const user = await User.findOne({ email: email });
    const isPasswordCorrect = await checkPassword(password, user.password);

    // Email handling
    if (!user) {
        unauthorizedErrors.push({
            value: email,
            msg: "Email doesn't match with any user",
            param: 'email',
            location: 'body'
        });
    }

    // Password handling
    if (!isPasswordCorrect) {
        unauthorizedErrors.push({
            value: password,
            msg: "Wrong password",
            param: 'password',
            location: 'body'
        });
    }

    // In case there are an Unautorized Error, we send a 401 status
    if (unauthorizedErrors.length > 0) {
        resp.status(401).json({
            error: "The credentials are incorrect"
        });
        console.log(unauthorizedErrors);
        return;
    }

    // if it is all okay, repond with the needed user information
    resp.status(200).json({
        msg: 'Login successful',
        user: {
            name: user.name,
            email: user.email,
            handle: user.handle
        }
    });
    console.log({
        msg: 'Login successful',
        user: {
            name: user.name,
            email: user.email,
            handle: user.handle
        }
    });
};