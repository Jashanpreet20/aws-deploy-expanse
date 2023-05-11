const express=require('express');

const routes=express.Router();

const expansecontroller=require('../controller/expanse');
const authmiddleware=require('../middleware/auth');

routes.post('/epanse/post',authmiddleware.authorization, expansecontroller.postData);
routes.get('/epanse/getall',authmiddleware.authorization,expansecontroller.getAll);
routes.delete('/epanse/deleteData/:id',expansecontroller.getdelete);
routes.get('/epanse/getData/:id',expansecontroller.getData)
routes.get('/download',authmiddleware.authorization,expansecontroller.getdownload);
routes.get('/getfiles',authmiddleware.authorization,expansecontroller.getfiles);

module.exports=routes;