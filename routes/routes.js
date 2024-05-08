var express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient();


// User route



router.route('/user/getAll').get((req, res) => {
    try {
        prisma.user.findMany({
            include: {
                c_Instructor: {
                    include: {
                        module: true
                    }
                },
                payment: true,
                enrollment: true
            }
        }).then((data) => {
            res.status(200)
                .json({ status: true, message: "Users retrieved successful", data, code: "200" });
        })

    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", code: 500 });
    }
})

router.route('/user/create').post((req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        Role: req.body.Role,
        v_Status: req.body.v_Status
    }
    prisma.user.create({ data })
        .then((data) => {
            if (data) {
                res.status(201).json({ status: true, message: `${data.Role} created successfully`, data, code: "201" });
            } else {
                res.status(400).json({ status: false, message: "Error creating user", code: "400" });
            }
            console.log("User Created", data);
        })
        .catch(error => {
            console.error("Error occurred:", error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Handle Prisma known request errors
                if (error.code === 'P2002') {
                    res.status(500).json({ status: false, message: "New user cannot be created with this email", code: "P2002" });
                }
            } else {
                res.status(500).json({ status: false, message: "An unexpected error occurred" });
            }
        });
});


router.route('/user/update/:id').patch((req, res) => {
    const _id = req.params.id
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        Role: req.body.Role,
        v_Status: req.body.v_Status
    }

    try {
        prisma.user.update({
            where: {
                id: _id
            },
            data
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "User Updated Sucessfully", data: data, role: data.Role, code: "200" })
            }
            else {
                res.status(404).json({ status: false, message: "User not found", code: "404" })
            }
        })
    } catch (error) {
        res.status(500).json({ status: false, message: "Error occured while updating", code: "500" })
    }
});

router.route('/user/delete/:id').delete((req, res) => {
    const _id = req.params.id
    try {
        prisma.user.delete({
            where: {
                id: _id,
            },
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "User deleted", code: "200" })
            } else {
                res.status(404).json({ status: false, message: "User not found", code: "404" });
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Error while deleting user", code: "500" });
        console.log("Error while deleting user", error);
    }
});


// Function for Retreive only the specific user based on the id
router.route('/user/get/:id').get((req, res) => {
    const _id = req.params.id
    try {
        prisma.user.findUnique({
            where: {
                id: _id,
            },
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "User found", user: data, role: data.Role, code: "200" })
            } else {
                res.status(404).json({ status: false, message: "User not found", code: "404" });
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Error while fetching user", code: "500" });
        console.log("Error while fetching user", error);
    }
});

router.route('/user/login').post((req, res) => {
    try {
        prisma.user.findUnique({
            where: {
                email: req.body.email,
                password: req.body.password
            }
        }).then((data) => {
            if (data) {
                console.log("Data",data);
                const token = generateToken(data.id);
                console.log("Token",token);
                res.status(200).json({ status: true, message: "Login sucessful", user: data, role: data.Role, token:token, code: "200" })
            }
            else {
                res.status(404).json({ status: false, message: "Login Unsucessfull", code: "404" })
            }
        })
    } catch (error) {
        res.status(500).json({ status: false, message: "Error while login", code: "500" })
    }
});
// Generating JWT Token for successful login
function generateToken(userId) {
    const crypto = require("crypto");
  
    // Generate a random secret key
    const secretKey = crypto.randomBytes(32).toString("hex");
    // Expires in 1 Hour
    const expiresIn = "1h";
  
    return jwt.sign({ userId }, secretKey, { expiresIn });
  }

// Learner route


router.route('/learner/getAll').get();

router.route('/learner/create').post();

router.route('/learner/update/:id').patch();

router.route('/learner/delete/:id').delete();

router.route('/learner/get/:id').get();

router.route('/learner/login').post();

module.exports = router;