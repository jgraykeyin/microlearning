function main() {

    console.log("Starting");
    let video = document.getElementById("vidframe");

    // Setting up click events for the Lesson links
    let lesson1 = document.getElementById("link-lsn1");
    lesson1.addEventListener("click", function(){

        // We'll need to insert a new video here
        video.src = "https://www.youtube.com/embed/5MgBikgcWnY"

    });

    let lesson2 = document.getElementById("link-lsn2");
    lesson2.addEventListener("click", function(){

        video.src = "https://www.youtube.com/embed/TQMbvJNRpLE"

    });

    let lesson3 = document.getElementById("link-lsn3");
    lesson3.addEventListener("click", function(){

        video.src = "https://www.youtube.com/embed/w-HYZv6HzAs"

    });

    let lesson4 = document.getElementById("link-lsn4");
    lesson4.addEventListener("click", function(){

        video.src = "https://www.youtube.com/embed/Nj-hdQMa3uA"
    });

    let lesson5 = document.getElementById("link-lsn5");
    lesson5.addEventListener("click", function(){

        video.src = "https://www.youtube.com/embed/TFbv757kup4"
    });
}

window.addEventListener("load", main);