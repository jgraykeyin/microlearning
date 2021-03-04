function main() {

    // Main function
    let button_login = document.getElementById("login-submit");
    button_login.addEventListener("click", loginAction);

    // Init our main user account
    localStorage.setItem("admin-email", "admin@testing.com");
    localStorage.setItem("admin-password", "123456");

}

// This function will trigger when the login button is pressed
function loginAction() {

    // Get the user input data
    let user_login = document.getElementById("login-user").value;
    let user_password = document.getElementById("login-password").value;

    // Check for the system's build-in login and password
    let admin_login = localStorage.getItem("admin-email");
    let admin_password = localStorage.getItem("admin-password");

    // Check to see if the user's credentials match up
    if (user_login === admin_login) {
        console.log("Yay the email address matched");

        if (user_password === admin_password) {
            // Succesful login
            console.log("Whoa the password matched too!");
            userSuccess();
        } else {
            alert("Password Error")
        }
    } else {
        alert("Wrong email address");
    }
}


function userSuccess() {
    console.log("Sending user to the logged in area");
    window.location.href = "viddemo2.html";
}

window.addEventListener("load", main);