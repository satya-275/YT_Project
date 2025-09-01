import { Router } from 'express'
import { userController } from '../controllers/users.controller.ts'

export const usersRouter = Router({ caseSensitive: true})

usersRouter.get('/getusers', userController.getUsersDetails)

