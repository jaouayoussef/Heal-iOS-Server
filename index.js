import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

import { createServer } from "http";
import { Server } from "socket.io";

import { validateJWT } from "./middleware/auth.js";
import {
  userConnected,
  userDisconnected,
  saveMessage,
} from "./controller/user.js";

import userRouter from "./route/user.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 1337;
const databaseName = "HealDB";
const dbURIOffline = `mongodb://localhost:27017/${databaseName}`;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use("/img", express.static("public/images"));
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose
  .connect(dbURIOffline, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/", (req, res) => {
  res.send({ message: "Default route" });
});

app.use("/user", userRouter);

io.on("connection", async (client) => {
  let token = client.handshake.auth.token;
  const [valid, uid,username] = await validateJWT(token);
  if (!valid) {
    return client.disconnect();
  }

  userConnected(uid);
  client.join(username);

  client.on("private-message", async (payload) => {
    await saveMessage(payload);
    io.to(payload.to).emit("private-message", payload);
  });

  client.on("is-typing", (payload) => {
    io.to(payload.to).emit("is-typing", payload);
  });

  client.on("disconnect", () => {
    userDisconnected(uid);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
