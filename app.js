const express=require('express');
const dotenv = require('dotenv');


const fs=require('fs');
const path=require('path');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');
const app=express();


const user=require('./models/user');
const expanse=require('./models/expanse');
const order=require('./models/orders');
const forgotpassword=require('./models/forgotpassword');
const fileUrl=require('./models/fileUrl');

// get config vars and you will declare before util database otherwise you will get error like access denied


dotenv.config();
const sequelize=require('./util/database');
const purchaseroutes=require('./routes/purchase');
const expanseroutes=require('./routes/expanse');
const adminroutes=require('./routes/admin');
const forgetroutes=require('./routes/forget');
const premiumfeatureroutes=require('./routes/premiumfeature');
const body=require('body-parser');
 const cors=require('cors');






// access logging data

const accessdatastream=fs.createWriteStream(
path.join(__dirname,'access log'), 
{flags: 'a'});

app.use(express.json()); 
app.use(helmet());
app.use(compression());
//app.use(morgan('combined',{stream:accessdatastream}));

//Association

user.hasMany(expanse);
expanse.belongsTo(user);

order.belongsTo(user);
user.hasMany(order);

user.hasMany(forgotpassword);
forgotpassword.belongsTo(user);

user.hasMany(fileUrl);
fileUrl.belongsTo(user);


app.use(body.json());
app.use(cors());

app.use(purchaseroutes);
app.use(forgetroutes);
app.use(adminroutes);
app.use(expanseroutes);
app.use(premiumfeatureroutes);



sequelize.sync({ force: false }).
then(order =>{
    //console.log('order table created')
})
.then(user => {
   // console.log('user table created');
})
.then(expanse => {
   // console.log('expanse table created');
})
.then(file=>{
    //console.log('file table created');
})
.then(forgot=>{
    app.listen(process.env.PORT  || 3000 ,() =>{
          console.log('server run at 3000');
          
})

})
.catch(err => console.log(err));


