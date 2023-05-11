const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    paymentid:Sequelize.STRING,
    orderid:Sequelize.STRING,
    status:Sequelize.STRING
});


// Order.sync({force:true}).then(result=>{
//     console.log('order table created');
// }).catch(err=> console.log(err))

module.exports=Order;