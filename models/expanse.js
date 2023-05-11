const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const expanse=sequelize.define('expanse',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey: true,
    },
    amount:Sequelize.DOUBLE,
    description:Sequelize.STRING,
    category:Sequelize.STRING
});

// expanse.sync({force : true}).then(result => {
//     console.log('expanse table created');
// })
// .catch(err => console.log(err));

module.exports=expanse;