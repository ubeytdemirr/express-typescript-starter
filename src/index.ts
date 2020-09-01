import cors from "cors"
import {createServer} from "http";
import services from "./services";



//EXPRESS
const express = require("express");
const app  = new express();
app.use(cors());
app.use(express.json());
app.use("/api",services)



// SERVER
const server = createServer(app);
server.listen(process.env.PORT);
server.on("listening",()=>{
    console.log(`Server is up and running on port : ${process.env.PORT}`)
})
