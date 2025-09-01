import { userService } from '../services/users.service.ts'
import type { Request, Response } from 'express'

export  const userController = {
    getUsersDetails : async function (req: Request, res: Response) {
    try {
        const user = await userService.getUsers();
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
}
}


