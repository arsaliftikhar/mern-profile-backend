const express = require("express")
const mongodb = require("mongodb")
const router = express.Router()


//models export
const Users = require("../models/Users")



//post create user
router.post("/create",async (req,res)=>{
    const {name,email,age,image} = req.body
    const newUser = new Users({
        name,
        email,
        age,
        image
    });

    await newUser.save()
    res.status(201).json(newUser);

})


//get users
router.get("/users",async (req,res)=>{
    try
    {
        const users = await Users.find({})
        res.json(users)
    }
    catch(error)
    {
        console.log("error",error)
        res.status(500).json({error:"Internal server error"})
    }
})


//get user by id
router.get("/users/:id",async (req,res)=>{
    try
    {
        const userId = req.params.id;
        const objectId = mongodb.ObjectId
        if(!objectId.isValid(userId))
        {
         return   res.status(400).json({message:"Invalid user id"})
        }
        
        const user = await Users.findById(userId)
        if(user)
        {
            res.json(user)
        }
        else
        {
            res.status(400).json({message:"user not found"})
        }
        
    }
    catch(error)
    {
        console.log("error",error)
        res.status(500).json({error:"Internal server error"})
    }
})


// Update user
router.put("/update", async (req, res) => {
    try 
    {
        const { id, name, email, age,image } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (age) updateData.age = age;
        if (image) updateData.image = image;

        const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) 
        {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } 
    catch (error) 
    {
        console.log("error", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



//Delete user
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findByIdAndDelete(id); 
        if(!user)
        {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "Internal server error" });
    }
});





module.exports = router