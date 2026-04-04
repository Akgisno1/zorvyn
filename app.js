require('dotenv').config();
const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan');
const authRoutes= require('./routes/authRoutes');

const app=express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth',authRoutes);

app.get('/health',(req,res)=>res.json({status:'healthy'}));

module.exports=app;
