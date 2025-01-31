const prisma = require("../prisma/prisma")

exports.list = async(req,res)=>{
    try{
        const user = await prisma.user.findMany({})
        res.json(user)
    }catch(err){
        res.status(500).json({message: "Server Error"})
    }
}

exports.update = async(req,res)=>{
    try{
        const {userId} = req.params
        const {email} = req.body
        const updated = await prisma.user.update({
            where:{
                id: Number(userId)
            },
            data:{
                email: email
            }
        })
        console.log(userId)
        res.json({message: "Updated Success"})
    }catch(err){
        res.status(500).json({message: "Server Error"})
    }
}

exports.remove = async(req,res)=>{
    try{
        const {userId} = req.params
        const removed = await prisma.user.delete({
            where:{
                id: Number(userId)
            }
        })
        res.status(200).json({message: "Deleted success"})
    }catch(err){
        res.status(500).json({message: "Server Error"})
    }
}
