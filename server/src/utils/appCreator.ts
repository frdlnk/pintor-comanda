import express, { Application } from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (): Application => {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use(morgan("dev"))
    app.use(helmet())
    app.use(cors())

    const frontendDistPath = path.resolve(__dirname, '../../app/dist');
    app.use(express.static(frontendDistPath));

    app.all('/{*a}', (req, res) => {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });

    return app;
}