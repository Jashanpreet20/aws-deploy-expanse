const user= require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

function isStringvalid(string)
{
    if(string === undefined || string.length === 0)
    {
        return true;
    }else{
        return false;
    }
}

    const generatetoken=(userid,name,ispremiumuser) =>
{
    const secretkey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjgxNDc1ODQ3fQ.eG_h3bUVgb57y6b4rw1PlKslungzCM23kHkof0hLy4k';
    return jwt.sign({ id:userid, name:name, ispremiumuser} , secretkey); 
}


 const postData=async(req,res,next)=>{
    const names=req.body.nm;
    const emails=req.body.em;
    const passwords=req.body.pwd;

    try{

    const alreadyregistered=await user.findOne({ where : {email : emails}}).catch(err => console.log(err));

    if(alreadyregistered){
        return res.status(400).json({message: "already registed user"});
    }

   else if(isStringvalid(names) || isStringvalid(emails) || isStringvalid(passwords)){
         return res.status(400).json({ message: "something went wrong"});      
    }
    else{
        
        // blow fish cryption
        bcrypt.hash(passwords,10, async(err,hash) =>{
            const data=await user.create({name:names,email:emails,Password: hash},  (err) =>{
                return res.status(404).json({message:"connot register at this moment"});
           })
           if(data)
           {
               return res.status(201).json({details:data});
           }
           
        })   
   }
}

  catch(err) {
    throw err;
  }
  
}

const getlogin= async (req,res,next) =>{
    const emails=req.body.em;
    const passwords=req.body.pwd;
    
   
    try{

        const alreadyregistered=await user.findOne({ where : {email : emails}}).catch(err => console.log(err));
        
        if(isStringvalid(emails) || isStringvalid(passwords)){
             return res.status(400).json({sucsces: false, message: "something went wrong"});      
        }
        if(!alreadyregistered){
            return res.status(404).json({sucsces: false, message:" user doesn't exist"});
        }
    
        bcrypt.compare(passwords , alreadyregistered.Password, (err,result) =>{
                if(err){
                    
                    console.log('password error');
                }
                if(result)
                {
                    return res.status(200).json({message:"User login succesfully" , sucsces: true , 
                    token:generatetoken(alreadyregistered.id,alreadyregistered.name,alreadyregistered.ispremiumuser )});
                }
                else{     
                    
                    return res.status(401).json({sucsces : false , message: "password doesn't match"}); 
               }
            })     
    }
    
      catch(err) {
        throw err;
      }
      
}


module.exports={
    generatetoken,
    getlogin,
    postData
};