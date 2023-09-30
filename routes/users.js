const express = require("express")
const router = express.Router()

//controllers
const userController = require('../controller/UserController')




//create user
router.post("/create", userController.createUser)

//get all users
router.get("/users",userController.getAllUsers)

//get user by id
router.get("/users/:id",userController.getUserById)

//update user
router.put("/update",userController.updateUser)

//delete user
router.delete("/delete/:id",userController.deleteUser)

//login user
router.post("/login",userController.loginUser)



module.exports = router