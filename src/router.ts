import { Router } from 'express';
import { body } from 'express-validator';
import { createAccount, login } from './handlers';
import { handleInputErrors } from './middleware/validation';
const router = Router();

//** Authentication and Register */

router.post('/auth/register',
    body('name')
        .notEmpty()
        .withMessage('The Name is required'),
    body('email')
        .notEmpty()
        .withMessage("The Email is required")
        .bail()
        .isEmail()
        .withMessage("The provided Email isn't valid"),
    body('password')
        .notEmpty()
        .withMessage("The Password is required")
        .bail()
        .isLength({ min: 8, max: 25 })
        .withMessage("The Password doesn't meet the requeriments"),
    body('handle')
        .notEmpty()
        .withMessage("The Handle is required"),
    handleInputErrors,
    createAccount
);

router.post('/auth/login',
    body('email')
        .notEmpty()
        .withMessage("The Email is required")
        .bail()
        .isEmail()
        .withMessage("The provided Email isn't valid"),
    body('password')
        .notEmpty()
        .withMessage("The Password is required"),
    handleInputErrors,
    login
);

export default router;