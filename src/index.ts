import 'module-alias/register';

import {createServer} from "http";

import mongoose from "mongoose"

import services from "@services/index";

import errorHandler from "@middlewares/ErrorHandler/ErrorHandler"

import cors from "@middlewares/cors/cors"

import ApiError from "@classes/ApiError/ApiError"

import passport from "@utils/passport/passport"

//EXPRESS
const express = require("express");

const app  = new express();

app.use(cors());

app.use(express.json());

app.use(passport.initialize())

app.use(passport.session())

app.use("/api",services)

app.use(errorHandler)

app.use((req,res) => {
  if(!req.route&&!res.headersSent){
    res.status(404).send(new ApiError(404,'This route is not found',true))
  }
})


// SERVER
const server = createServer(app);

const {PORT,MONGO_DEV,MONGO_PRODUCTION,NODE_ENV} = process.env

const MONGO_STRING = NODE_ENV==="production"?MONGO_PRODUCTION:MONGO_DEV

server.listen(PORT||5000);

server.on("listening",()=>{
    console.info(`Server is up and running on port ${process.env.PORT} in ${NODE_ENV} mode 🚀`)
    mongoose.set('returnOriginal',true)
    mongoose.connect(MONGO_STRING,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
      if(!err) console.info('Database connection is successfull. 👍')
      else console.error('Database connection is failed 👎 : ' ,err)
    })
})

server.on("error",(err)=>{
  console.log("Server is not running! 👎 : ", err)
})
