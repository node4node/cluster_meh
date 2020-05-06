import express from "express";
import { Express } from "express";
import { createServer } from "http";
const app: Express = express();

app.get("/", (req, res, next) => {
  res.send("Hello World!");

  console.log(`Served by worker with process id (PID) ${process.pid}.`);
});

const server = createServer(app);

server
  .on("listening", () => {
    console.log("App listening on port 3000");
  })
  .listen(3000);
