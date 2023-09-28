const express = require("express")
const morgan = require("morgan")
const cors = require("cors")



const userRoute = require("./routes/users")

const app = express()
const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0'


app.use(morgan("dev"))
app.use(cors())
app.use(express.json())



//db connection
const db = require("./config/db");
db.connect()


app.use("/",userRoute)



app.listen(port,host,()=>{
    console.log(`server is running at ${port}...`);
})