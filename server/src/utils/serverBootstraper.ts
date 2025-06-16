import appCreator from "./appCreator.js";
import {createServer} from "http"

export default () => {

    const app = appCreator()

    const server = createServer(app)
    server.listen(process.env.PORT || 3000, () => console.log("[Server Bootstraper]: Server ready for requests"))

    return server

}