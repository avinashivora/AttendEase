
const Users = require("./../models/user")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const fs = require("fs")

dotenv.config({
    path : "./../.env"
})

mongoose.connect(process.env.DATABASE_LOCAL).then(()=>{
    console.log("Connected")
}).catch(err => {
    console.log(err)
})

const jsonFilePath = "./../data/users.json"

const users = JSON.parse(fs.readFileSync(jsonFilePath))

const insertMany = async() => {
    try {
        await Users.create(users)
        console.log("Data imported")
    }catch(err){
        console.log(err)
    }
    process.exit()
}
insertMany()