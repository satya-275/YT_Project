import { userService } from '../services/users.service.ts'
import type { Request, Response } from 'express'

export const userController = {
    getUsersDetails: async function (req: Request, res: Response) {
        try {
            const result = await userService.getUsers();
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    }
}


