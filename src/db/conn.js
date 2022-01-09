const mongoose = require("mongoose")

mongoose.connect(process.env.DB).then(() => {
    console.log("connected to data base")
}).catch((err) => {
    console.log("not connected to data base")
})