const mongodb = require("mongodb")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//snipits export
let randomToken = require('../snipits/randomToken');
let sendEmail = require('../snipits/sendEmail');


//models export
const Users = require("../models/Users")





//post create user
let createUser = async (req, res) => {
    try {
        const {user_name,email,password} = req.body

        //input validations
        if (!user_name) {
            return res.status(400).json({ status: "error",message:"user_name is required"});
        }
        else if (!email) {
            return res.status(400).json({ status:"error",message:"email is required" });
        }
        else if (!password) {
            return res.status(400).json({ status:"error",message: "password is required" });
        }

        // //check username already used or not
        // const checkUser = await Users.findOne({user_name:user_name})
        // if(checkUser)
        // {
        //     return res.status(400).json({ status:"error",message: "username already used" });
        // }


        // //check email already used or not
        // const checkEmail = await Users.findOne({email:email})
        // if(checkEmail)
        // {
        //     return res.status(400).json({ status:"error",message: "email already used" });
        // }

        
        //hash password before save
        const hashedPassword = await bcrypt.hash(password, 10);

        //create verification link
        randomToken = randomToken(10)
        const verificationLink = process.env.DOMAIN_URL+'/email-verification/'+user_name+'/'+randomToken

        console.log(verificationLink)

        const newUser = new Users({
            user_name,
            email,
            password:hashedPassword,
            verification_code:randomToken
        });

        if(await newUser.save())
        {
            // email send start 
            const htmlBody = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Account Created</title><style>body{font-family:Arial,sans-serif;line-height:1.6;background-color:#f8f8f8;margin:0;padding:20px;text-align:center;}.container{max-width:600px;margin:0 auto;background-color:#fff;border-radius:10px;padding:40px;}.btn{display:inline-block;padding:10px 20px;font-size:16px;text-decoration:none;background-color:#4caf50;color:white;border-radius:5px;transition:background 0.3s ease;}.btn:hover{background-color:#45a049;}</style></head><body><div class="container"><h3>Account Created Successfully</h3><p>Hi <strong>'+user_name+'</strong>,</p><p>Your account has been created successfully.</p><p>Click the button below to verify your email address:</p><p><a class="btn" href="'+verificationLink+'">Verify Email</a></p><p>Thank you!</p></div></body></html>'
            sendEmail(email,'Verify your email address',htmlBody)
            //email send end


            res.status(201).json({status:"success",message:"User created successfully verify email",data:newUser});
        }

    }
    catch (error) 
    {
        console.log("Error: ", error);
        res.status(500).json({ status:"error",message:"Internal server error" })
    }
}

//get users
let getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({},{password: 0})
        res.json({status:"success",message:"all users data found",data:users})
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ status:"error",message:"Internal server error" }) 
    }
}

//get user by id
let getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const objectId = mongodb.ObjectId
        if (!objectId.isValid(userId)) {
            return res.status(400).json({ status:"error",message:"Invalid user id" })
        }

        const user = await Users.findById(userId)
        if (user) {
            res.json({status:"success",message:"user found successfully",data:user})
        }
        else {
            res.status(400).json({status:"error",message:"user not found" })
        }

    }
    catch (error) {
        console.log("error", error)
        res.status(500).json({status:"error",message:"Internal server error" })
    }
}

// Update user
let updateUser = async (req, res) => {
    try {
        const { id, user_name, email, passsword } = req.body;

        const updateData = {};
        if (user_name) updateData.user_name = user_name;
        if (email) updateData.email = email;
        if (passsword) updateData.passsword = passsword;
        
        const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({status:"error",message:"User not found" });
        }

        res.json({status:"success",message:"user updated successfully",data:updatedUser});
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({status:"error",message:"Internal server error" });
    }
}


//Delete user
let deleteUser =  async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({status:"error",message:"User not found" });
        }
        res.json({status:"error",message:"user deleted successfully",data:user});
    } catch (error) {
        console.log("error", error);
        res.status(500).json({status:"error",message:"Internal server error" });
    }
}

//user login
let loginUser = async (req,res)=>{
    
    const { user_name, password } = req.body;

    if (!user_name) {
        return res.status(400).json({status:"error",message:"enter username" })
    }
    if (!password) {
        return res.status(400).json({status:"error",message:"enter password" })
    }

    const user = await Users.findOne({ user_name: user_name });

    if (!user) {
        return res.status(404).json({status:"error",message:"invalid username" })
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({status:"error",message:"invalid password" })
    }

    const token = jwt.sign({ userName: user.user_name }, 'this-is-my-secret-key')

    res.json({status:"success",message:"login successfully",data:{token,user}})


}




module.exports = {createUser,getAllUsers,getUserById,updateUser,deleteUser,loginUser}