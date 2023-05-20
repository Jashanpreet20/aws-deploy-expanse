


var form = document.getElementById('addValue');
var lemail = document.getElementById('lemail');
var lpassword = document.getElementById('lPassword');
var signup=document.getElementById('signup');
var forget=document.getElementById('forget');


signup.addEventListener('click',signuppage);
forget.addEventListener('click',forgetpage);


function forgetpage(e){
    window.location.href="http://127.0.0.1:5500/views/forget.html";
}
function signuppage(e)
{
    window.location.href="http://127.0.0.1:5500/views/signup.html";
}


form.addEventListener('submit', addItem);

function addItem(e) {
    e.preventDefault();
    const user = {        
        em: e.target.email.value,
        pwd: e.target.Password.value,
    }

    axios.post("http://localhost:3000/user/login",user)
   .then(res =>{
        alert('succussfully login');
        console.log('successfully login');   
       // console.log(res.data.token);
        localStorage.setItem('token',res.data.token);
        window.location.href="http://127.0.0.1:5500/views/expanse.html";
                             
}).catch(err =>{
    console.log('something went wrong');
   });
    
form.reset();
}
