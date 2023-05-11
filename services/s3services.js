const AWS=require('aws-sdk');

const uploadToS3 = (data,filenmae) =>
{
    try{
        const BUCKET_NAME='expansetrackingapp';
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    let s3bucket= new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })  
    
        var params={
            Bucket: BUCKET_NAME,
            Key:filenmae,
            Body:data
        }
       return new Promise((res,rej) =>{
        s3bucket.upload(params, (err, s3resonpse) =>{
            if(err)
            {
                console.log('something went wrong' , err);
                rej(err);
            }else{
               console.log('added' ,s3resonpse);
                res(s3resonpse.Location);
            }
        })
       })
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message:"something went wrong",error:err,success:false});
    }
          
}

module.exports={
    uploadToS3
}