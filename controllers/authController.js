const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const prisma=require('../config/prisma');

const register=async(req,res)=>{
    const {name,email,password,role}=req.body;
    try{
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await prisma.user.create({
            data:{name,email,password:hashedPassword,role}
        });
        res.status(201).json({message: 'User created',userId:user.id});
    }catch(error){
        res.status(400).json({error: 'User registration failed'});
    }
};    

const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await prisma.user.findUnique({where:{email}});
        if(!user||!(await bcrypt.compare(password,user.password))){
            return res.status(401).json({error: 'Invalid credetials'});
        }
        const token=jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.status(201).json({token,user:{id:user.id,name:user.name,role:user.role}});
    }catch(error){
        res.status(500).json({error: 'Login failed'});
    }
};

module.exports={register,login};