import express from "express"
import cors from "cors"
import dotenv from "dotenv"


const app=express()
app.use(express.json())
app.use(cors())
dotenv.config()

app.get("/health",(req,res)=>{
    res.json({
        status:"ok",
        message:"server is running"
    })
})

const port = process.env.PORT || 5000


app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})