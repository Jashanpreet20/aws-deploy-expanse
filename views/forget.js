
var form = document.getElementById('addValue');
var lemail = document.getElementById('lemail');

form.addEventListener('submit', addItem);

function addItem(e) {
    e.preventDefault();
    const user = {        
        em: e.target.email.value,
    }

    console.log(user);

    axios.post("http://localhost:3000/forgotpassword",user)
   .then(res =>{
        
        console.log('successfull send link');   
       // console.log(res.data.token);
       // window.location.href="http://127.0.0.1:5500/views/login.html";
                             
}).catch(err =>{
    console.log('something went wrong');
   });
    
form.reset();
}
