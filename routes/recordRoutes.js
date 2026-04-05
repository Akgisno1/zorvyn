const express=require('express');
const {createRecord,getRecords}=require('../controllers/recordController');
const {authenticate,authorise}=require('../middlewares/auth');
const router=express.Router();

router.post('/',authenticate,authorise(['ADMIN']),createRecord);
router.get('/',authenticate,authorise(['ADMIN','ANALYST','VIEWER']),getRecords);

module.exports=router;