import { eq } from 'drizzle-orm';
import { db } from '../../configurations/db_config.ts';
import { users } from '../schemas/users.ts';
import UserInput from '../interfaces/users.interface.ts';

export const userService = {
    addUser: async function (data: UserInput) {
        try {
            const result = await db.insert(users).values([
                {
                    name: data.name,
                    email: data.email
                }
            ]);

            if (result && result.rowCount === 0) {
                throw new Error("User could not be added");
            }

            return result;
        } catch (err) {
            throw err;
        }
    },

    getUsers: async function () {
        try {
            const result = await db.select().from(users);
            return result; // empty array if no users
        } catch (err) {
            throw err;
        }
    },

    patchUser: async function (email: string, data: Partial<UserInput>) {
        try {
            const result = await db
                .update(users)
                .set(data)
                .where(eq(users.email, email));

            if (result && result.rowCount === 0) {
                throw new Error("User not found or no changes made");
            }

            return result;
        } catch (err) {
            throw err;
        }
    },

    deleteUser: async function (email: string) {
        try {
            const result = await db
                .delete(users)
                .where(eq(users.email, email));

            if (result && result.rowCount === 0) {
                throw new Error("User not found");
            }

            return result;
        } catch (err) {
            throw err;
        }
    }
};
