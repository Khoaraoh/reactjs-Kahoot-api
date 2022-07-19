import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import path from "node:path";
import dotenv from "dotenv";
import http from "http";
import { checkConnect, dbConnect } from "./utils/db.js";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { disconnectHandle, hostHandle, playerHandle } from "./socket/index.js";
const corsOptions = {
    origin: "*",
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

// Express setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use("/api", routes);
app.use(cors(corsOptions));

dotenv.config();

// dirname setup
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup public folder
app.use(express.static(path.join(__dirname, "public")));

// set up routes

app.get("/", (req, res) => {
    res.send("API is ready on " + new Date());
});

io.on("connection", (socket) => {
    console.log(`user ${socket.id} connect to socket server`);

    playerHandle(io, socket);
    hostHandle(io, socket);
    disconnectHandle(io, socket);
});

//Start server
dbConnect()
    .then((message) => {
        console.log(message);
    })
    .catch((err) => console.log(err));

if (checkConnect) {
    server.listen(PORT, () => {
        console.log(`socket is listening on port ${PORT}`);
    });
} else {
    server.close();
}
