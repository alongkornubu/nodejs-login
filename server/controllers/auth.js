const prisma = require('../prisma/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req,res)=>{
    try{
        const {email,password} = req.body
        // 1 validate
        if(!email){
            return res.status(400).json({
                message: 'Invalid Email'
            })
        }
        if(!password){
            return res.status(400).json({
                success: false,
                message: 'Invalid Password'
            })
        }
        // 2 check email
        const checkUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(checkUser){
            return res.status(409).json({
                message: 'Email already exist'
            })
        }
        
        
        // 3 hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)
        //4 register
        const userData = {
            email: email,
            password: hashPassword
        }
        
        const newUser = await prisma.user.create({
            data: userData,
            select:{
                id: true,
                email: true
            }
        })
        res.json({
            message: "Register Success"
        })

    }catch(err) {
        console.log(err)
        res.send("Server Error").status(500)
    }
}

exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body
        if (!email){
            return res.status(400).json({message: 'email is require'})
        }
        if (!password){
            return res.status(400).json({message: 'password is require'})
        }
        // 1 check email in db
        const user = await prisma.user.findUnique({
            where:{
                email: email,
            }
        })
        if (!user){
            return res.status(400).json({
                message: "Invalid Credentail"
            })
        }
        // 2 compare password
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch){
            return res.status(400).json({
                message: "Password is not match"
            }) 
        }
        // 3 create payload
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
        // 4 create token
        const token = jwt.sign(payload,'kaika',{
            expiresIn: '1d'
        })
        // console.log(token)
        res.json({
            user: payload.user,
            token: token
        })
    }catch(err){
        console.log(err)
        res.json({
            message: "server error"
        }).status(500)
    }
}