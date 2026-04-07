//! create an express server and check if it's working

import "dotenv/config";
import express from "express";
import cors from "cors"; // cross origin resource sharing (browser blocks the request which comes from anywhere but localhost:8000)
// 1) we are importing express module which we installed using npm i

import { connectDB } from "./config/database-config.js";
import userRoutes from "./routes/auth-route.js";

// 2) call/invoke the function
let app = express(); // object = {listen}

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.urlencoded({ extended: true }));// this 
app.use(express.json());

app.use("/api/auth", userRoutes); // http://localhost:9001/api/auth/signup

// 3) assign a port number to our server
const PORT = 9001;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
// app.listen(PORT_NUMBER, callback)

//! to check if the server is running, in cmd(git bash), goto backend folder and type "npx nodemon index.js"
// open browser -> localhost:PORT_NUMBER and press enter

// https://nodejs.org/en/ (/) =>  this is base url
// https://nodejs.org/en/blog => /blog is one endpoint
// https://nodejs.org/en/download

// https://github.com/Sarvesh-1999/NIGHT-CODING-MARATHON
