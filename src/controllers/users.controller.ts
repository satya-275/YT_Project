import { userService } from '../services/users.service.ts'
import type { Request, Response } from 'express'

export const userController = {
    addUserDetails: async function (req: Request, res: Response) {
        try {
            const result = await userService.addUser(req.body);
            res.status(201).send(result);
        } catch (err) {
    const error = err as Error;
    return res.status(400).json({ error: error.message });
}
    },
    getUsersDetails: async function (req: Request, res: Response) {
        try {
            const result = await userService.getUsers();
            res.status(200).send(result);
        } catch (err) {
    const error = err as Error;
    return res.status(400).json({ error: error.message });
}
    },
    updateUserDetails: async function (req: Request, res: Response) {
        try {
            const { email } = req.params;
            const result = await userService.patchUser(email, req.body);
            res.status(200).send(result);
        } catch (err) {
    const error = err as Error;
    return res.status(400).json({ error: error.message });
}
    },
    delUserDetails: async function (req: Request, res: Response) {
        try {
            const { email } = req.params;
            const result = await userService.deleteUser(email);
            res.status(204).send(result);
        } catch (err) {
    const error = err as Error;
    return res.status(400).json({ error: error.message });
}
    },
}


