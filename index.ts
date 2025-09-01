import { db } from "./configurations/db_config.ts";
import { usersRouter } from "./src/routes/users.route.ts";
import express  from 'express';

async function main() {
    try {
        const app = express();
        app.use(express.json(), express.urlencoded({extended: true}));
        app.use('/users', usersRouter);
        app.listen('5000', () => {
            console.log('Listening')
        })
        const res = await db.execute('SELECT current_database();');
        console.log(res.rows);

    } catch (err) {
        
    }
}

main().catch((err) => {
    
})
