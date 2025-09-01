import { Router } from 'express'
import { userController } from '../controllers/usersController.ts'

export const usersRouter = Router({ caseSensitive: true})

usersRouter.get('/getUsers', userController.getUsersDetails)

