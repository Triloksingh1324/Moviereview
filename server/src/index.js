import dbConnect from "./db/database.js";
import dotenv from "dotenv"
import { app } from "./app.js";
dotenv.config({
    path:"./.env"
})
const port=process.env.PORT||9000
dbConnect()

.then(()=>{
    app.listen(port,()=>{
        // <h2>hey bckend</h2>
        console.log(`port is running on ${port}`)
    })

    app.get("/",(req,res)=>{
        res.send("hello")
    })
})
.catch((err)=>{
    console.log("connection error",err)
})