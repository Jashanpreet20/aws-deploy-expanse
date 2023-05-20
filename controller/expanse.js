const User=require('../models/user');
const s3Services=require('../services/s3services');
const expanse=require('../models/expanse');
const sequelize=require('../util/database');
const FileUrl=require('../models/fileUrl');


 const postData=async(req,res,next)=>{
    const amount=req.body.amn;
    const des=req.body.dec;
    const category=req.body.crt;  
    const t=await sequelize.transaction();

     try{
        
       const expanses= await expanse.create({amount:amount,description:des,category:category , userId:req.user.id},{transaction:t});
       const total=Number(req.user.totalexpanse) + Number(amount);
       // console.log(total);

        await User.update({
            totalexpanse : total
        },{ where : {id: req.user.id }, transaction: t
        })
        await t.commit();
        res.status(201).json({details:expanses});
     }
     catch(err) {
         await t.rollback();
        return res.status(400).json({success: false, message: err});
     }  
}

    const getAll=async(req,res,next)=>{       
      try{
        
        const page= +req.query.page || 1;
        const limit= +req.query.limit || 3;

        const data=await expanse.findAll({ where : { userid : req.user.id } ,
            offset: (page - 1) * limit,
            limit: limit
        });
        
        const alldata= await expanse.findAll({where : {userId : req.user.id}});
        if(data)
        {   
           // console.log(req.user.totalexpanse);
            //console.log(data);
            res.status(201).json({
                details: data , hasnextpage: (limit * page < alldata.length),
                nextpage: page+1,
                currentpage:page,
                haspreviouspage: page > 1,
                previosPage: page -1
            });
        }
        else{
            return res.status(400).json({message:'data not fetched'});
        }
       }
    catch(err) {
        console.log(err);
        res.status(400).json('something went wrong');
        }
     }

        
     const getdelete = async(req,res,next)=>{
        const t=await sequelize.transaction();
       try{
        const id=req.params.id;
         const del = await expanse.destroy({where :{id:id }} ,{transaction:t} );
          
        //  const data=await User.findByPk(id);
        //  const total=Number(req.user.totalexpanse) - Number(data.amount);
        //   console.log(total);
  
        //   await User.update({
        //       totalexpanse : total
        //   },{ where : {id: req.user.id }, transaction: t
        //   })
         
          if(del)
          {
           await t.commit();
            res.status(201).json({success:true ,message:'successfully deleted'});
          }
       }
       catch(err) {
        console.log(err);
        await t.rollback();
        return res.status(400).json({success: false, error: err});
       }
      }
    
       const getData=async(req,res,next)=>{
        const id=req.params.id;
        const data=await expanse.findByPk(id);
        res.status(201).json({details:data});
    }

   
     const getdownload= async(req,res) =>{
        
            try{
                const expanses= await expanse.findAll({ where : { userid : req.user.id }});
            // console.log(expanses);
            const userid=req.user.id;
           // console.log(userid);
             const stringfiedata=JSON.stringify(expanses);
             const filename=`expense${userid}/${new Date()}.txt`;
             const fileURL= await s3Services.uploadToS3(stringfiedata,filename);

             FileUrl.create({userId:req.user.id,fileUrl:fileURL});

            // console.log(fileURL);
             res.status(200).json({fileURL,  success:true, message:'successfully downloaded'});    
            }
            catch(err)
            {
                console.log('something went wrong',err);
                res.status(500).json({message:'something went wrong', success:false});
            }
        

    }

    const getfiles=async (req,res) =>{
       try{
           const data=await FileUrl.findOne({ where : { userId : req.user.id }}); 
            if(data)
            {
                //console.log(data);
                res.status(201).json({details:data});
            }
            else{
                return res.status(400).json({message:'data not fetched'});
            }
           }
        catch(err) {
            console.log(err);
            res.status(400).json('something went wrong');

            }
    }

    

    module.exports={
            postData,
            getAll,
            getdelete,
            getData,
            getdownload,
            getfiles
    }