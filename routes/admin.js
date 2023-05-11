
const express=require('express');

const routes=express.Router();
const admincontroller=require('../controller/admin');

routes.post('/user/post',admincontroller.postData);

routes.post('/user/login',admincontroller.getlogin);

module.exports=routes;