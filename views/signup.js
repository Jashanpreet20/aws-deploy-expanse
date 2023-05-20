
var form = document.getElementById('addValue');
var name = document.getElementById('name');
var email = document.getElementById('email');
var password = document.getElementById('password');
var login=document.getElementById('login');
form.addEventListener('submit', addItem);

login.addEventListener("click",loginpage);

function loginpage(e)
{
    window.location='http://127.0.0.1:5500/views/login.html';

}



function addItem(e) {
    e.preventDefault();
    const user = {
        nm: e.target.name.value,    
        em: e.target.email.value,
        pwd: e.target.Password.value,
       
    }

     const response=axios.post("http://localhost:3000/user/post",user)
   .then(res =>{

        console.log('succesfully registerd')
        window.location='http://127.0.0.1:5500/views/login.html';
        
}).catch(err =>{
    console.log('something went wrong');
   });
    

form.reset();
}
