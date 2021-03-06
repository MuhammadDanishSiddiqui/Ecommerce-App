const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const cloudinary = require("cloudinary")
const fileupload = require("express-fileupload")
const cors = require("cors")
dotenv.config({ path: path.resolve(__dirname, '../.env') })
require("./db/conn")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET
})
const userRouter = require("./routes/user")
const productRouter = require("./routes/product")
const orderRouter = require("./routes/order")
const paymentRouter = require("./routes/payment")

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', '*');
    next();
});
app.use(express.json())
app.use(fileupload())
app.use("/api", userRouter)
app.use("/api", productRouter)
app.use("/api", orderRouter)
app.use("/api", paymentRouter)

const staticPath = path.join(__dirname, "../client/build")


if (process.env.NODE_ENV == "production") {
    app.use(express.static(staticPath));
    app.get("*", (req, res) => {
        res.sendfile(path.resolve(__dirname, "../client", "build", "index.html"))
    })
}

app.listen(port, () => {
    console.log("server is up at port " + port)
})