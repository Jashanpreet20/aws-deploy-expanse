
const express=require('express');

const routes=express.Router();

const premiumfeaturecontroller=require('../controller/premiumfeature');
const auth=require('../middleware/auth');

routes.get('/getpremiumuserdetails', auth.authorization, premiumfeaturecontroller.getleaderboard);

module.exports=routes;