function main() {

    async function fetchJSONData() {

        // Fetch the JSON file
        let url="jsondata/lesson1.json";
        let response = await fetch(url);
        let quiz = await response.json();

        // Set the video file to a localStorage variable
        localStorage.setItem("videofile", quiz[0]["video_file"])

        // Access the video player elements
        let video_source = document.getElementById("video-source");
        let video_player = document.getElementById("video-player");

        // Load the video into the document and play it
        video_player.pause();
        video_source.src = "video/" + quiz[0]["video_file"];
        video_player.load();

        // Jump to start of Question Clip
        // Start video at clip start time
        video_player.currentTime = quiz[0]["quiz"][0]["clip_start"];
        video_player.play();

        // Setup an event listener to stop the video at the clip_stop time
        video_player.addEventListener("timeupdate", function() {
            if (this.currentTime >= quiz[0]["quiz"][0]["clip_end"]) {
                
                // Stop the video
                this.pause();

                // Hide the video player
                video_player.style.display = "none";

                // Show the question area
                let question_area = document.querySelector(".question-area");
                question_area.style.display = "flex";

                // Set the question title
                let question_title = document.querySelector(".question-title");
                question_title.innerHTML = quiz[0]["quiz"][0]["question"];

                // Set the quiz options
                let option_a = document.getElementById("option-a");
                let option_b = document.getElementById("option-b");
                let option_c = document.getElementById("option-c");
                let option_d = document.getElementById("option-d");

                // Insert the quiz options into the document
                option_a.innerHTML = quiz[0]["quiz"][0]["a"];
                option_b.innerHTML = quiz[0]["quiz"][0]["b"];
                option_c.innerHTML = quiz[0]["quiz"][0]["c"];
                option_d.innerHTML = quiz[0]["quiz"][0]["d"];


            }
        })

    }

    console.log("Good day");

    // Pull in JSON Data
    fetchJSONData();


    // Setup the audio button
    let audioBtn = document.getElementById("audio-button");
    audioBtn.addEventListener("click", function() {
        let video_player = document.getElementById("video-player");
        video_player.muted = !video_player.muted;

        if (audioBtn.innerText === "Turn on sound") {
            audioBtn.innerText = "Turn off sound";
        } else {
            audioBtn.innerText = "Turn on sound";
        }
    });


    // Setup the hamburger button
    let hamburgerBtn = document.querySelector(".hamburger-btn");
    hamburgerBtn.addEventListener("click", function() {
        //hamburgerBtn.classList.toggle("change");

        // Make the side panel pop out or go back in
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