import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleInputErrors = (req: Request, resp: Response, next: NextFunction) => {
    // this variable will contain all bad request errors that we setted up in the route with expess-validator
    const badRequestErrors = validationResult(req);

    // Validate if the request has "bad request" errors and respond with a 400 status if it does
    if (!badRequestErrors.isEmpty()) {
        resp.status(400).json({
            errors: badRequestErrors.array().map(error => error.msg)
        });
        console.log(badRequestErrors);
        return;
    }

    // this allows the middleware to continue to the next function on the route
    next();
}