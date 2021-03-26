function main() {
    console.log("Good day");

    // Setup the hamburger button
    hamburgerBtn = document.querySelector(".main-container");
    hamburgerBtn.addEventListener("click", function() {
        hamburgerBtn.classList.toggle("change");
        
        const max_width = "320px";
        sidenav = document.querySelector(".sidenav")
        if (sidenav.style.width === max_width) {
            sidenav.style.width = "0px";
        } else {
            sidenav.style.width = max_width
        }
    });
}

window.addEventListener("load", main);