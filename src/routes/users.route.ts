import { Router } from 'express'
import { userController } from '../controllers/users.controller.ts'
import { validateUserFields, validateEmailParam } from '../middlewares/users.middleware.ts'

export const usersRouter = Router({ caseSensitive: true})

usersRouter.post('/add', validateUserFields({name: true, email: true}), userController.addUserDetails)
usersRouter.get('/getusers', userController.getUsersDetails)
usersRouter.patch('/update/:email', validateUserFields({requireParamEmail: true}), userController.updateUserDetails)
usersRouter.delete('/delete/:email', validateEmailParam(), userController.delUserDetails)


