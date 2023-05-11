const expanse=require('../models/expanse');

const getexpanse=(req,res) =>{
     return expanse.findAll({ where : { userid : req.user.id }});
}


module.exports={
    getexpanse
}