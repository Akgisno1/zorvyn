const prisma =require('../config/prisma');

const createRecord=async(req,res)=>{
    const {amount,type,category,date,description}=req.body;
    try{
        const record=await prisma.financialRecord.create({
            data:{
                amount,
                type,
                category,
                date:new Date(date),
                description,
                userId:req.user.id
            }
        });
        res.status(201).json({message:'Record created successfully',record});
    }catch(err){
        res.status(500).json({error:'Failed to create record',message:err.message});
    }
};

const getRecord=async(req,res)=>{
    const {category,type,startDate,endDate}=req.query;
    const where={};
    if(category) where.category=category;
    if(type) where.type=type;
    if(startDate||endDate){
        where.date={
            ...(startDate&&{gte:new Date(startDate)}),
            ...(endDate&&{lte:new Date(endDate)})
        };
    }

    try{
        const records=await prisma.financialRecord.findMany({where});
        res.json(records);
    }catch(err){
        res.status(500).json({error:'Failed to fetch records',err});
    }
};

module.exports={
    createRecord,
    getRecord};