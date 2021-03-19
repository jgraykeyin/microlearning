function main() {
    console.log("Good day");

    hamburgerBtn = document.querySelector(".main-container");

    hamburgerBtn.addEventListener("click", function() {
        console.log("Clicky");
        hamburgerBtn.classList.toggle("change");
    })
}

window.addEventListener("load", main);