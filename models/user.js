
const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const user=sequelize.define('user',{
    id: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        allowNull:false,
        autoIncrement: true
    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    Password:Sequelize.STRING,
    ispremiumuser:Sequelize.BOOLEAN,
    totalexpanse:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
});



module.exports=user;