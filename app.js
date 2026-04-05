require('dotenv').config();
const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan');
const authRoutes= require('./routes/authRoutes');
const recordRoutes= require('./routes/recordRoutes');
const summaryRoutes= require('./routes/summaryRoutes');

const app=express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/health',(req,res)=>res.json({status:'healthy'}));

app.use('/api/auth',authRoutes);
app.use('/api/records',recordRoutes);
app.use('/api/summary',summaryRoutes);


module.exports=app;
