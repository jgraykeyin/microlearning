function main() {

    localStorage.setItem("item", 0);

    async function fetchJSONData() {

        // Get the item index ready
        let i = localStorage.getItem("item");

        // Get the current name of the html page
        let path = window.location.pathname;
        let page = path.split("/").pop();
        console.log(page);

        let filename = ""
        // Load the appropriate JSON file based on the html file currently being used
        if (page == "performance.html") {
            filename = "performance.json";
        } else if (page == "devopplans.html") {
            filename = "dev-op-plans.json";
        } else if (page == "devcritbudgets.html") {
            filename = "devcritbudgets.json"
        }

        // Fetch the JSON file
        let url="jsondata/" + filename;
        let response = await fetch(url);
        let quiz = await response.json();

        // Store the json object into local storage
        localStorage.setItem("data", JSON.stringify(quiz));

        // Set the video file to a localStorage variable
        localStorage.setItem("videofile", quiz[0]["video_file"]);

        // Save the answer to local storage
        localStorage.setItem("answer",quiz[0]["quiz"][i]["answer"]);

        // Access the video player elements
        let video_source = document.getElementById("video-source");
        let video_player = document.getElementById("video-player");

        // Load the video into the document and play it
        video_player.pause();
        video_source.src = "video/" + quiz[0]["video_file"];
        video_player.load();

        // Jump to start of Question Clip
        // Start video at clip start time
        video_player.currentTime = quiz[0]["quiz"][i]["clip_start"];
        video_player.play();

        // Setup an event listener to stop the video at the clip_stop time
        video_player.addEventListener("timeupdate", function() {

            let x = localStorage.getItem("item");
            if (this.currentTime >= quiz[0]["quiz"][x]["clip_end"]) {
                
                // Stop the video
                this.pause();

                // Hide the video player & the audio button
                video_player.style.display = "none";
                let audioBtn = document.getElementById("audio-button");
                audioBtn.style.display = "none";

                // Show the question area
                let question_area = document.querySelector(".question-area");
                question_area.style.display = "flex";

                // Set the question title
                let question_title = document.querySelector(".question-title");
                question_title.innerHTML = quiz[0]["quiz"][x]["question"];

                // Set the quiz options
                let option_a = document.getElementById("option-a");
                let option_b = document.getElementById("option-b");
                let option_c = document.getElementById("option-c");
                let option_d = document.getElementById("option-d");

                // Insert the quiz options into the document
                option_a.innerHTML = quiz[0]["quiz"][x]["a"];
                option_b.innerHTML = quiz[0]["quiz"][x]["b"];
                option_c.innerHTML = quiz[0]["quiz"][x]["c"];
                option_d.innerHTML = quiz[0]["quiz"][x]["d"];
            };
        });
    };

    // Pull in JSON Data
    fetchJSONData();

    // Setup the submit answer button event
    let submitBtn = document.getElementById("submit-answer");
    submitBtn.addEventListener("click", function() {
        console.log("Submit clicked!");


        // Get the user's selected option
        let user_answer = document.querySelector("input[name='quiz-option']:checked").value;

        // Get the answer from the json data
        let answer = localStorage.getItem("answer");

        if (user_answer === answer) {

            // Load up the json data
            let quiz = JSON.parse(localStorage.getItem("data"));
            console.log(quiz)
            
            // Increment the item index
            let item = parseInt(localStorage.getItem("item"));
            localStorage.setItem("item", item + 1);

            // Hide the question area
            let question_area = document.querySelector(".question-area");
            question_area.style.display = "none";

            // Show the video player
            let video_player = document.getElementById("video-player");
            video_player.style.display = "block";
            console.log(quiz[0]["quiz"][item+1]["clip_start"]);
           
            video_player.currentTime = quiz[0]["quiz"][item+1]["clip_start"];
            video_player.play()

        } else {
            alert("WRONG!");
        }
    })


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
