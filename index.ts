import { createServer } from "./src/server.ts";

async function main() {
    try {
        const app = createServer();

        app.listen(5000, "127.0.0.1", () => {
            console.log("Server listening");
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
}

main();
