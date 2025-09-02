import { eq } from 'drizzle-orm';
import { db } from '../../configurations/db_config.ts'
import { users } from '../schemas/users.ts'
import UserInput from '../interfaces/users.interface.ts';

export const userService = {
    addUser: async function (data: UserInput) {
        try {
            return await db.insert(users).values([
                {
                    'name': data.name,
                    'email': data.email
                }
            ]);
        } catch (err) {
            return err;
        }
    },
    getUsers: async function () {
        try {
            return await db.select().from(users);
        } catch (err) {
            return err;
        }
    },
    patchUser: async function (email: string, data: Partial<UserInput>) {
        try {
            return await db
                .update(users)
                .set(data)
                .where(eq(users.email, email));
        } catch (err) {
            return err;
        }
    },
    deleteUser: async function (email: string) {
        try {
            return await db
                .delete(users)
                .where(eq(users.email, email));
        } catch (err) {
            return err;
        }
    }
}