const User=require('../models/user');
const Expanse=require('../models/expanse');
const e = require('cors');



const getleaderboard= async (req,res) =>{

    try{
        const users= await User.findAll();
        const expanses=await Expanse.findAll();
        const useraggregatedarray= {};
        console.log(expanses);

        expanses.forEach((expanse) => {
            if(useraggregatedarray[expanse.userId]){
                useraggregatedarray[expanse.userId]=useraggregatedarray[expanse.userId]+ expanse.amount;
            }
            else{
                useraggregatedarray[expanse.userId]= expanse.amount;
            }
        });

        const userleaderboarddetails=[];
        users.forEach((user) =>{
            userleaderboarddetails.push({name : user.name, total_cost:useraggregatedarray[user.id]});
        })
        
        console.log(userleaderboarddetails);
        userleaderboarddetails.sort((a,b) => b.total_cost - a.total_cost);

        res.status(200).json(userleaderboarddetails);

        }
    catch(err){

        console.log(err);
         res.status(500).json('something went wrong in premium feature file');
    }
}



module.exports={
    getleaderboard
}