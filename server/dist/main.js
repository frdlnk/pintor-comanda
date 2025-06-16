import { Server } from "socket.io";
import serverBootstraper from "./utils/serverBootstraper.js";
import { SocketServer } from "./io.js";
import { removeReadyRequests } from "./cron/RequestDeleter.js";
import cron from 'node-cron';
const server = serverBootstraper();
function bootstrap() {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    SocketServer(io);
    cron.schedule("*/30 * * * *", () => removeReadyRequests(io));
    console.log("[CRON_JOB]: Limpieza de comandas programada en 30 minutos");
}
bootstrap();
