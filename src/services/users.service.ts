import { db } from '../../configurations/db_config.ts'
import { users } from '../../schemas/users.ts'

export const userService = {
    getUsers: async function () {
        try {
            return await db.select().from(users);
        } catch (err) {
            return err;
        }
    }
}