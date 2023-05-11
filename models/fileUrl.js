const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const fileUrl=sequelize.define('file',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey: true,
    },
    fileUrl:Sequelize.STRING,
    
});

// fileUrl.sync({force : true}).then(result => {
//     console.log('file table created');
// })
// .catch(err => console.log(err));

module.exports=fileUrl;