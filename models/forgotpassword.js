const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//id, name , password, phone number, role

const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})

// Forgotpassword.sync({force : true})
// .then(data=>{
//     console.log('forgot password table created');
// })
// .catch(err =>{
//     console.log(err);
// })

module.exports = Forgotpassword;