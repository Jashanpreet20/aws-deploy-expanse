

var form = document.getElementById('addValue');
var itemList = document.getElementById('items');
var amount = document.getElementById('amount');
var disc = document.getElementById('des');
var catg = document.getElementById('cat');
var showboard=document.getElementById('leaderboard');
var downloadbutton=document.getElementById('download');



showboard.addEventListener('click',showleaderboard);
var showfiles=document.getElementById('showfiles');
downloadbutton.addEventListener('click',download);

form.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem);
itemList.addEventListener('click', editItem);

downloadbutton.style.visibility='hidden';

function addItem(e) {
    e.preventDefault();
   // console.log(1);
    const user = {
        amn: e.target.amt.value,    
        dec: e.target.dsc.value,
        crt: e.target.ctg.value,
        
    }

    const token=localStorage.getItem('token')

    axios
    .post("http://localhost:3000/epanse/post", user,{headers:{'Authorization':token}})
   .then(res =>{
    console.log(('data added'))
    showData((res.data.details))

})
   .catch(err=>console.log(err));
    //console.log(user);

form.reset();
}


document.getElementById('razorypay_btn').onclick= async function (e)
{
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/purchasepremium' , { headers :{'authorization' : token}}  );
    console.log(response);

    var options=
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,

        "handler":async function(response)
        {
          const res= await axios.post('http://localhost:3000/updatetransaction',{
                order_id:options.order_id,
                payment_id: response.razorpay_payment_id
            },  {headers :{'authorization' : token} })

            console.log(res);
            alert('you are a premium user now');
            document.getElementById('razorypay_btn').style.visibility='hidden';
            document.getElementById('message').innerHTML='you are a premium user now';
            localStorage.setItem('token',res.data.token);
            showleaderboard();

           
        }
    };

    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment failed', function(response) {
        console.log(response);
        alert('something went wrong payment failed');
    })
}

function removeItem(e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Are You sure?')) {
            var li = e.target.parentElement;
            
            console.log(li.id);
            axios
    .delete(`http://localhost:3000/epanse/deleteData/${li.id}`)
    .then(res=>{console.log('data deleted');
        itemList.removeChild(li)})
    .catch(err=>console.log(err));  
        }
    }
}

function editItem(e) {
    if (e.target.classList.contains('edit')) {
        if (confirm('Are You sure?')) {
             var editingId = e.target.parentElement;
             console.log(editingId.id);
             axios
             .get(`http://localhost:3000/epanse/getData/${editingId.id}`)
             .then((res) =>{
                console.log("res data "+JSON.stringify(res.data.details))
                amount.value=res.data.details.amount,
                disc.value=res.data.details.description,
                catg.value=res.data.details.category
            })
                .catch(err=>console.log(err))

                axios
             .delete(`http://localhost:3000/epanse/deleteData/${editingId.id}`)
           // item = JSON.parse(localStorage.getItem(editingId));
            //console.log(editingId);
            .then(res=> itemList.removeChild(editingId))
        }
    }

}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function shows(){   
    showfiles.onclick=async() => {
        const token=localStorage.getItem('token');
        var userleaderboardarray=await axios.get("http://localhost:3000/getfiles" ,{ headers :{'authorization' : token}})
        .then(res=>{
            for(var i=0;i<res.data.details.length;i++){
                //console.log("res dtaa"+JSON.stringify(res.data.details[i].id));
               showfiles(res.data.details[i])
                }          
                   })
        .catch(err =>{
            console.log(err);
        }) 
       
    }
}

function showleaderboard(){

   showboard.onclick=async() => {
   const token=localStorage.getItem('token');
    const decode=parseJwt(token);
    const isadminpremiumuser=decode.ispremiumuser;
    if(isadminpremiumuser)
    {
        const token=localStorage.getItem('token');
        const userleaderboardarray=await axios.get("http://localhost:3000/getpremiumuserdetails" ,{ headers :{'authorization' : token}})
        console.log(userleaderboardarray);
        
        var leaderboardelem=document.getElementById('leaderboardlist');
        leaderboardelem.innerHTML += '<h1> Leader Board </h1>';
        
        userleaderboardarray.data.forEach((details) =>{
            leaderboardelem.innerHTML += `<li>Name - ${details.name} Total expanse -${details.totalexpanse}`;
            
             })
      }
      else{
        alert('buy premium');
      }
          
        }
}
function download(){
    const token=localStorage.getItem('token');
    axios.get('http://localhost:3000/download',  { headers :{'authorization' : token}} )
    .then((response) => {
        if(response.status === 200){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}


function downloadshow()
{
    document.getElementById('download').style.visibility='visible';
}

function showpremiumuser()
{
    document.getElementById('razorypay_btn').style.visibility='hidden';
    document.getElementById('message').innerHTML='you are a premium user now';

}
window.addEventListener("DOMContentLoaded",()=>{
    var page = 1;
    localStorage.setItem('limit',3)
    var limit = localStorage.getItem('limit')
    console.log('i M Limit>>', limit);

    const token=localStorage.getItem('token');
    const decode=parseJwt(token);
    const isadminpremiumuser=decode.ispremiumuser;
    if(isadminpremiumuser)
    {
        downloadshow();
        showpremiumuser();
        showleaderboard();
        shows();
    }


      

    axios
    .get(`http://localhost:3000/epanse/getall?page=${page}&limit=${limit}`,{ headers :{'authorization' : token}})
.then((res)=>{
    //console.log("res dtaa"+JSON.stringify(res.data.details[1].id));
   for(var i=0;i<res.data.details.length;i++){    
       //console.log("res dtaa"+JSON.stringify(res.data.details[i].id));
       showData(res.data.details[i])       
    }
    showPage(res.data);
})
.catch(err=>console.log(err));})


const Pagination = document.getElementById('pagination')


function showPage({
    hasnextpage,
    nextpage,
    currentpage,
    haspreviouspage,
    previouspage
}){
    Pagination.innerHTML = '';

    if(haspreviouspage){
        const btn2 = document.createElement('button')
        btn2.innerHTML ="previous page"
        btn2.addEventListener('click', ()=>getExpenses(previouspage))
        Pagination.appendChild(btn2)
    }
    const btn1 = document.createElement('button')
    btn1.innerHTML ="current page"
    btn1.addEventListener('click', ()=>getExpenses(currentpage))

    if(hasnextpage){
        const btn3 = document.createElement('button')
        btn3.innerHTML ="next page"
        btn3.addEventListener('click', ()=>getExpenses(nextpage))
        Pagination.appendChild(btn3)
    }
}

function getExpenses(page){
    const limit = localStorage.getItem('limit')
    const token = localStorage.getItem('token')
    console.log('Get expenses is calling or not?OutSide the api')
    axios.get(`http://localhost:3000/epanse/getall?page=${page}&limit=${limit}`,{headers:{"Authorization":token}})
    .then(response=>{
        console.log(response)
        console.log('Get expenses calling successfully');
       
        for(var i=0;i<response.data.details.length;i++){    
            //console.log("res dtaa"+JSON.stringify(res.data.details[i].id));
            showData(response.data.details[i])       
         }
        showPage(response.data)
    }).catch(err=>{
        console.log('get expenses is falling>>>')
        console.log("Error>>",err)
    })
}


function setLimit(e){
    e.preventDefault()
    const limit = document.getElementById('limit').value
    localStorage.setItem('limit', limit)
    console.log(limit);
}


function showfiles(e)
{
    var file=e.id;
    var li=document.createElement('li');
    li.appendChild(document.createTextNode(file));
    var filelist=document.getElementById('fileslist');
    filelist.append(li);
}
function showData(e){

    var newItem = e.amount;
    var newDes = e.description;
    var newCat =e.category;

    // const th=document.getElementById('thitemname')
    // const cte=document.getElementById('thamount')
    // const pre=document.getElementById('thcategory')
    // const action=document.getElementById('action');
    
    //   const tr = document.createElement('tr');
    //   const tr1 = document.createElement('tr');
    //   const tr2 = document.createElement('tr');
    //   const tr3=document.createElement('tr');

    //    var deleteBtn = document.createElement('button');
    //    deleteBtn.appendChild(document.createTextNode('Delete'));
       
    //    var btnEdit = document.createElement('button');
      
    //    btnEdit.appendChild(document.createTextNode('Edit Details'));
    
    //   tr.appendChild(document.createTextNode(newCat));
    //   tr1.appendChild(document.createTextNode(newDes));
    //   tr2.appendChild(document.createTextNode(newItem));
    //   tr3.appendChild(deleteBtn);
    //  // tr3.appendChild(btnEdit);

    //  th.appendChild(tr1)
    //  cte.appendChild(tr2);
    //  pre.appendChild(tr);
    //  action.append(tr3);
     
     

 //tbl.append(thead);

    var li = document.createElement('li');
    var thitemname=document.getElementById('thitemname');
    li.id=e.id
    li.className = 'list-group-item';
    li.appendChild(document.createTextNode(newItem + " " + newDes + " " + newCat));
    
    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger exteme-right delete';
    deleteBtn.appendChild(document.createTextNode('Delete'));
    li.appendChild(deleteBtn);
    var btnEdit = document.createElement('button');
    btnEdit.className = 'btn btn-primary float-end edit';
    btnEdit.appendChild(document.createTextNode('Edit Details'));
    li.appendChild(btnEdit);
    itemList.append(li);


}