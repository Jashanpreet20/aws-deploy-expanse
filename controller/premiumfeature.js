const User=require('../models/user');
const Expanse=require('../models/expanse');
const sequelize = require('../util/database');



const getleaderboard= async (req,res) =>{

  try{
    const leaderboard= await User.findAll({
     
      order:[['totalexpanse','DESC']]
    });
     

    res.status(200).json(leaderboard);

    }
catch(err){

    console.log(err);
     res.status(500).json('something went wrong in premium feature file');
}
   
}



module.exports={
    getleaderboard
}

// const leaderboard= await User.findAll({
//   attributes:['id','name',[sequelize.fn('sum', sequelize.col('expanses.amount')),'total_cost']],
//   include:[
//     {
//       model: Expanse,
//       attributes: []
//     }
//   ],
//   group:['user.id'],
//   order:[['total_cost','DESC']]
// });
 

// res.status(200).json(leaderboard);


// try{
//   const users= await User.findAll();
//   const expanses=await Expanse.findAll();
//   const useraggregatedarray= {};
//   console.log(expanses);

//   expanses.forEach((expanse) => {
//       if(useraggregatedarray[expanse.userId]){
//           useraggregatedarray[expanse.userId]=useraggregatedarray[expanse.userId]+ expanse.amount;
//       }
//       else{
//           useraggregatedarray[expanse.userId]= expanse.amount;
//       }
//   });

//   const userleaderboarddetails=[];
//   users.forEach((user) =>{
//       userleaderboarddetails.push({name : user.name, total_cost:useraggregatedarray[user.id]});
//   })
  
//   console.log(userleaderboarddetails);
//   userleaderboarddetails.sort((a,b) => b.total_cost - a.total_cost);

//   res.status(200).json(userleaderboarddetails);

//   }
// catch(err){

//   console.log(err);
//    res.status(500).json('something went wrong in premium feature file');
// }