const csv = require("csvtojson")
const mongoose = require("mongoose")
const Students = require("../models/studentsSchema")
// const Users = require("../models/user")
const Users = require("./../models/user")
const { EventEmitterAsyncResource } = require("nodemailer/lib/xoauth2")

require("dotenv").config({
    path : "./../.env"
})

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
    console.log("Connected")
}).catch(err => {
    console.log(err)
})

const csvFilePath = "../productionData/studentData_SY_DS.csv"; 

csv().fromFile(csvFilePath).then((jsonObj)=>{
    let jsonData = jsonObj
    // console.log(jsonData)
    
    jsonData = jsonData.map(data=> {
        // console.log(data)
        return {
            ...data,
            name: `${data.firstName} ${data.middleName} ${data.lastName}`,
            subjects : data.subjects.slice(1,-1).split(",").map(subject => subject.trim()),
            subjectType : data.subjectType.slice(1,-1).split(",").map(subjectType => subjectType.trim()),
            batch : data.batch.slice(1,-1).split(",").map(batch => batch *1)
        }
    })
    
    updateMany(jsonData)
    
})

const updateMany = async(jsonData) =>{
    
    for(let i=0;i<jsonData.length;i++){
            const update = {
                firstName : jsonData[i].firstName,
                middleName : jsonData[i].middleName,
                lastName : jsonData[i].lastName,
            }
            
            console.log(jsonData[i].email)
            const user = await Users.findOneAndUpdate({email:jsonData[i].email},{$set:update},{new : true})
            
            //would have to change unique attribute of seatNumber to false in student model
            const studentUpdate = {
                name : jsonData[i].firstName + jsonData[i].middleName + jsonData[i].lastName,
                seatNumber : jsonData[i].seatnumber 
                // seatNumber : i 
            } 
            const student = await Students.findByIdAndUpdate(user.studentId,studentUpdate,{new:true})
    }
    
    process.exit()    
}
