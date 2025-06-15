import express, { Application } from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"

export default (): Application => {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use(morgan("dev"))
    app.use(helmet())
    app.use(cors())

    return app;
}