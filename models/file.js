const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const File=sequelize.define('file',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey: true,
    },
    fileUrl:Sequelize.STRING,
   
});


File.sync({force:true}).then(result=>{
    console.log('file table created');
}).catch(err=> console.log(err))

module.exports=File;