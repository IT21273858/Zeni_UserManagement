var express = require('express');

const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


// Admin route



router.route('/admin/getAll').get((req, res) => {
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
            .json({ status: true, message: "Admins retrieved successful", data });

    })
})

router.route('/admin/create').post((req,res)=> {
    const data={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        phoneNumber:req.body.phoneNumber,
        Role:req.body.Role,
        v_Status:req.body.v_Status
    }
    prisma.user.create({
       data
    }).then((data) =>{
        res.status(201).json({status:true,message:` ${data.Role} created Succesfully`, data})
        console.log("User Created",data);
    })
});

router.route('/admin/update/:id').patch();

router.route('/admin/delete/:id').delete();

router.route('/admin/get/:id').get();

router.route('/admin/login').post();


// Learner route


router.route('/learner/getAll').get();

router.route('/learner/create').post();

router.route('/learner/update/:id').patch();

router.route('/learner/delete/:id').delete();

router.route('/learner/get/:id').get();

router.route('/learner/login').post();

module.exports = router;