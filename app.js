import 'dotenv/config'
import { request } from "http";
import mongoose from "mongoose";
import { data } from "./data.js";
import bcrypt from "bcryptjs"
import chalk from "chalk";
import express, { response } from "express";
import postModel from "./postSchema.js";
import e from "express";
import userModel from "./models/userSchema.js";
import cors from "cors"


const app = express();


























const PORT = process.env.PORT;
const DBURI = process.env.MONGODB_URI;



















app.use(express.json());
app.use(express.urlencoded({extended:true}))


mongoose.connect(DBURI);

mongoose.connection.on("connected", () => console.log("MongoDB Connected"));

mongoose.connection.on("error", (err) => console.log("MongoDB Error", err));


// app.get('/products',(request,response)=>{
//     response.send(data)
// })

// // single product
// app.get('/products/:id',(request,response)=>{
//     const singleProid = request.params.id
//     const filterData = data.filter((e,i)=> e.id == singleProid)
//     response.send(filterData)
// })

// app.get('/products',(req,res)=>{
   
//     console.log(req.query.id);  
//     if(req.query.id){
//         const filterData = data.filter((e,i)=> e.id == req.query.id);
//         res.send(filterData);
//         return;

//     }
//     res.send(data)
// })



app.get('/',(request,response)=>{
    response.send("server running on /")
})
                               


                                                // get put post delete 



// app.get('/get',async(req,res)=>{
//     const getData = await postModel.find({})
//     res.json({
//         message : "post get",
//         data: getData,
//     });
//     res.send("get post")
// });
// app.post('/post',async (req,res)=>{
//     const {title,desc,postId} = req.body;

//     if (!title || !desc ||!postId){
//         res.json({
//             message : "fields missing"
//         });
//         return;
//     }

//     const postObj = {
//         title,
//         desc,
//         postId,
//     }

//     const response = await postModel.create(postObj);

//     res.json({
//         message:"post created",
//         data : response,
//     })

//     res.send("create post")
// })
// app.put('/updatepost',async (req,res)=>{
//     const {title,desc,postId} = req.body;
//     console.log(title,desc,postId);

//     const updatePost = await postModel.findByIdAndUpdate(postId,{title,desc});

//     res.json({
//         message : "post has been updated",
//         data : updatePost,

//     })
// })
// app.delete('/delete/:id',async (req,res)=>{
//     const params = req.params.id;

//     await postModel.findByIdAndDelete(params);

//     res.json({
//         message : "delete post",
//     })

// })

app.post("/api/signup",async (req,res)=>{
    const { firstName,lastName,email,password} = req.body;

    if(!firstName || !lastName || !email || !password){
        res.json({
            message : "fields are missing",
            status  : false,
        });
        return;
    }

 const emailExist =await userModel.findOne({ email });
 
 console.log("emailExist",emailExist);

 if(emailExist !== null){
    res.json({
        message : "email exists",
        status: false
    })
    return;
 }

    
    const hashPassword = await bcrypt.hash(password,10);
    console.log("hashPassword",hashPassword);

    let userObj = {
        firstName,
        lastName,
        email,
        password : hashPassword,
    }

    // create user on db

    const createUser = await userModel.create(userObj);

    res.json({
        message: "user created successfully..",
        status : true
    });
    console.log(body);
    res.send("Signup api")
});


// login api
app.post("/api/login",async(req,res)=>{
    const {email,password} = req.body

    
    if(!email || !password){
        res.json({
            message : "fields are missing",
            status  : false,
        });
        return;
    }

    const emailExist = await userModel.findOne({ email });
    if(!emailExist){
        res.json({
            message : "invalid email && password",
            status : false,
        });
        return
    }
    const comparePassword = await bcrypt.compare(password,emailExist.password);

    if(!comparePassword){
        res.json({
            message : 'invalid email && password',
            status: false 
        });
        return
    }
    res.json({
        message: "login successfully",
        status : true
    })
    
})


app.listen(PORT,()=>{
    console.log(chalk.green.bgWhite.bold(`server running on port: ${PORT}`))
})

