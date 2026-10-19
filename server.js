require("dotenv").config();
const app = require("./src/app")
const db = require("./src/config/db")

db();

app.listen(3000,()=>{
    console.log("Server is listening on port 3000");
})