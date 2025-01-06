import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount } from './handlers'
const router = Router()

//** Authentication and Register */

router.post('/auth/register',
    body('name')
        .notEmpty()
        .withMessage('The Name is required'),
    body('email')
        .isEmail()
        .withMessage('The Email is required'),
    body('password')
        .isLength({ min: 8, max: 25 })
        .withMessage("The password does't meet the requeriments"),
    body('handle')
        .isEmpty()
        .withMessage("The Handle is required"),
    createAccount)

export default router