document.addEventListener('DOMContentLoaded',()=> {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) =>{
        event.preventDefault();

        const errorBox = document.getElementById('error-message');
        const user_email = document.getElementById('email').value.trim();
        const user_password = document.getElementById('password').value.trim();
        
        errorBox.classList.add('hidden');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if(user_email == "" || user_password == "")
        {
            errorBox.classList.remove('hidden');
            errorBox.innerHTML = "Please fill all fields";
        }
        else if(!emailPattern.test(user_email))
        {
            errorBox.classList.remove('hidden');
            errorBox.innerHTML = "Please enter valid email";
        }
        else if(!passwordPattern.test(user_password))
        {
            errorBox.classList.remove('hidden');
            errorBox.innerHTML = "<strong>Invalid Password:</strong><br>Must be at least 8 characters, with an uppercase letter, a lowercase letter, and a number.";
        }
        else{
            location.href="MainMenu.html";
        }
    });
})