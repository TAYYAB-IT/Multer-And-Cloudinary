const express = require('express')
const mongoose = require('mongoose')
const monogo=require('./DB_connection')
const users = require('./Schema')
monogo('mongodb+srv://tybtest90:testing1122@cluster0.hqfbo.mongodb.net/FileUploader');
const app=express()
const multer=require('multer');
const cloudinary=require('cloudinary')
//setting up cloudinary
cloudinary.config({
    cloud_name:'testmongo',
    api_key:'833666544545995',
    api_secret:'BPQ7uQY-Sokz8cH1wjPcjN11D00',
    secure:true
})
app.use(express.json())
//Set Storage
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    }
    ,filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname)
    }
})
//filter file
const file_filter=(req,file,cb)=>{
    if(file.mimetype==='image/png' ||file.mimetype==='image/jpeg'||file.mimetype==='image/jpg')
    cb(null,true)
    else
    cb(null,false)
}
const upload=multer({storage:storage,limits:{fileSize:5*1024*1024},fileFilter:file_filter}) //filesize in Bytes
app.post('/upload',upload.single('file'),async(req,res,next)=>{
    if(!req.file){
        res.status(400).send("Please Upload a file")
        next(new Error("Please Upload a file"))
    }
    else{
        try{
            //upload file on cloudinary & return properties of uploded file
        var result =await cloudinary.uploader.upload(req.file.path)}
        catch (error){
            res.send(error)
        }
        finally{
        res.json({
            message:'File uploaded',
            result
            
        })
        user=new users()
        user.name=req.body.name
        user.file_public_id=result.public_id
        user.file_url=result.secure_url
        user.save((err,data)=>{
            if(err){
                console.log("Database Error="+err)
            }
        })
        console.log("public_id="+result.public_id,"\nsecure_url="+result.secure_url)
    }
    }
})
//Fetch image from cloudinary
app.get('/show',async(req,res)=>{
    const result=await cloudinary.image('https://res.cloudinary.com/testmongo/image/upload/v1641538466/mzgbpqhj3llqsh2809q5.png',{type:'fetch'}) //pass secure_url
    res.json({profile:result})
})
//Deletion file from cloudinary
app.delete('/delete',async(req,res)=>{
    try{
   await cloudinary.uploader.destroy('mzgbpqhj3llqsh2809q5') //pass public_id
   res.send('File Deleted')
    }
    catch(error){
        res.send(error)
    }
})
app.listen(3000,()=>{
    console.log("Server is Active")
})