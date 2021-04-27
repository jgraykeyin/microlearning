async function fetchJSONData() {
    // This function fetches our data from JSON files

    // Get the current name of the html page
    let path = window.location.pathname;
    let page = path.split("/").pop();

    let filename = ""
    // Load the appropriate JSON file based on the html file currently being used
    if (page === "performance") {
        filename = "performance.json";
        localStorage.setItem("course", "performance");
    } else if (page === "devopplans") {
        filename = "dev-op-plans.json";
        localStorage.setItem("course", "devops");
    } else if (page === "devcritbudgets") {
        filename = "devcritbudgets.json"
        localStorage.setItem("course", "budgets");
    } else if (page === "culture") {
        filename = "organizationalCulture.json";
        localStorage.setItem("course", "culture");
    } else if (page === "timestress") {
        filename = "time-stress-management.json";
        localStorage.setItem("course", "stress")
    }

    // Fetch the JSON file
    let url="jsondata/" + filename;
    let response = await fetch(url);
    let quiz = await response.json();

    // Store the JSON object in localStorage so we can access it from other functions
    localStorage.setItem("data", JSON.stringify(quiz));

    // Get the Lesson start date
    let start_date = new Date(Date.parse(quiz[0]["start_date"]));

    // Get the current date of today
    let today = new Date();

    // Get the number of days / weeks between days
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((today - start_date) / oneDay));
    const numWeeks = Math.floor(diffDays / 7);

    // Save the Week Number
    localStorage.setItem("numWeeks", numWeeks);

    // Display the course title in the header
    let lessonName = document.querySelector(".lesson-name");
    lessonName.innerHTML = quiz[0]["lesson_name"];

    // Track the user's progres
    getUserProgress();

    // Display the first available question
    showQuestion();
}


function showQuestion() {

    // Get the JSON data
    let quiz = JSON.parse(localStorage.getItem("data"));

    let index = parseInt(localStorage.getItem("currentQuestion"));
    let numWeeks = parseInt(localStorage.getItem("numWeeks"));
    
    // Get the current question title
    let question = quiz[0]["quiz"][index]["question"];
    let order_area = document.querySelector(".order-area")
    let question_area = document.querySelector(".question-area");
    let truefalse_area = document.querySelector(".truefalse-area");
    let dragdrop_area = document.querySelector(".dragdrop-area");
    let checkbox_area = document.querySelector(".cbquestion-area");

    let number_area = document.querySelector(".number-counter");
    let tf_number_area = document.getElementById("num-tf");

    if (numWeeks > 19) {
        numWeeks = 19;
    }

    let html = `Question ${index+1} of ${numWeeks+1}`
    number_area.innerHTML = html;
    tf_number_area.innerHTML = html;

    // Set the question title
    let order_title = document.querySelector(".order-title");
    let question_title = document.querySelector(".question-title");
    let truefalse_title = document.querySelector(".truefalse-title");
    let dd_title = document.querySelector(".dd-title");
    let cb_statement = document.querySelector(".cbquestion-statement")
    let cb_title = document.querySelector(".cbquestion-title")
    

    console.log(index)
    console.log(numWeeks)
    if (index > numWeeks) {

        let result_area = document.querySelector(".result");
        let result_title = document.querySelector(".result-title");
        let result_body = document.querySelector(".result-body");

        let play_btn = document.getElementById("play-btn");
        let next_btn = document.getElementById("next-btn");

        truefalse_area.style.display = "none";
        question_area.style.display = "none";
        result_area.style.display = "flex";
        order_area.style.display = "none"
        result_title.innerHTML = "All done";
        result_body.innerHTML = "Check back next week for another question.";
        play_btn.style.display = "none";
        next_btn.style.display = "none";


    } else if (quiz[0]["quiz"][index]["true"]) {
        // This is a the true-false questions
        truefalse_area.style.display = "flex";
        checkbox_area.style.display = "none"
        question_area.style.display = "none";
        dragdrop_area.style.display = "none";
        order_area.style.display = "none"
        truefalse_title.innerHTML = quiz[0]["quiz"][index]["question"];

    } else if (quiz[0]["quiz"][index]["sequence"]){
        //This is a sequence order questions
        order_area.style.display = "flex"
        truefalse_area.style.display = "none";
        question_area.style.display = "none";
        checkbox_area.style.display = "none"
        dragdrop_area.style.display = "none";
        order_title.innerHTML = quiz[0]["quiz"][index]["question"];

        let order_1 = document.getElementById("order-1");
        let order_2 = document.getElementById("order-2");
        let order_3 = document.getElementById("order-3");
        let order_4 = document.getElementById("order-4");

        order_1.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][0];
        order_2.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][1];
        order_3.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][2];
        order_4.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][3];


    } else if (quiz[0]["quiz"][index]["heading_a"]) {
        // This is a drag drop question
        truefalse_area.style.display = "none";
        question_area.style.display = "none";
        checkbox_area.style.display = "none"
        order_area.style.display = "none"
        dragdrop_area.style.display = "flex";
        dd_title.innerHTML = quiz[0]["quiz"][index]["question"];

        let dd1 = document.getElementById("dd-item-1");
        let dd2 = document.getElementById("dd-item-2");
        let dd3 = document.getElementById("dd-item-3");
        let dd4 = document.getElementById("dd-item-4");
        let dd5 = document.getElementById("dd-item-5");
        let dd6 = document.getElementById("dd-item-6");

        let title_a = document.getElementById("column-a");
        let title_b = document.getElementById("column-b");

        // Populate the draggable answers
        dd1.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][0];
        dd2.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][1];
        dd3.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][2];

        dd4.innerHTML = quiz[0]["quiz"][index]["answer_column_b"][0];
        dd5.innerHTML = quiz[0]["quiz"][index]["answer_column_b"][1];
        dd6.innerHTML = quiz[0]["quiz"][index]["answer_column_b"][2];

        title_a.innerHTML = quiz[0]["quiz"][index]["heading_a"];
        title_b.innerHTML = quiz[0]["quiz"][index]["heading_b"];

    } else if (quiz[0]["quiz"][index]["statement"]){
        checkbox_area.style.display = "flex"
        truefalse_area.style.display = "none";
        dragdrop_area.style.display = "none";
        question_area.style.display = "none";
        order_area.style.display = "none"
        cb_statement.innerHTML = quiz[0]["quiz"][index]["statement"];
        cb_title.innerHTML = quiz[0]["quiz"][index]["question"]

        //display current option for question in document
        let cboption_a = document.getElementById("cboption-a");
        let cboption_b = document.getElementById("cboption-b");
        let cboption_c = document.getElementById("cboption-c");
        let cboption_d = document.getElementById("cboption-d");
        
        cboption_a.innerHTML = quiz[0]["quiz"][index]["a"];
        cboption_b.innerHTML = quiz[0]["quiz"][index]["b"];
        cboption_c.innerHTML = quiz[0]["quiz"][index]["c"];
        cboption_d.innerHTML = quiz[0]["quiz"][index]["d"];
    } else {
        // This is a regular multiple choice question
        question_area.style.display = "flex";
        truefalse_area.style.display = "none";
        checkbox_area.style.display = "none";
        dragdrop_area.style.display = "none";
        order_area.style.display = "none";
        question_title.innerHTML = quiz[0]["quiz"][index]["question"];

        // Display the current options in the document
        let option_a = document.getElementById("option-a");
        let option_b = document.getElementById("option-b");
        let option_c = document.getElementById("option-c");
        let option_d = document.getElementById("option-d");
        
        option_a.innerHTML = quiz[0]["quiz"][index]["a"];
        option_b.innerHTML = quiz[0]["quiz"][index]["b"];
        option_c.innerHTML = quiz[0]["quiz"][index]["c"];
        option_d.innerHTML = quiz[0]["quiz"][index]["d"];
    }

    // Save the answer to local storage
    let answer = quiz[0]["quiz"][index]["answer"];
    localStorage.setItem("answer", answer);
}


function processAnswer() {

    let user_answer = "";

    // Get the answer from the json data
    let answer = localStorage.getItem("answer");
    let tf_answer = localStorage.getItem("tf_answer");

    let question_area = document.querySelector(".question-area");
    let result_area = document.querySelector(".result");
    let truefalse_area = document.querySelector(".truefalse-area");
    let result_title = document.querySelector(".result-title");
    let result_body = document.querySelector(".result-body");
    let play_btn = document.getElementById("play-btn");
    let next_btn = document.getElementById("next-btn");
    let question_index = parseInt(localStorage.getItem("currentQuestion"));
    let numWeeks = parseInt(localStorage.getItem("numWeeks"));

    // If it's a true or false question, setup the user's answer from localstorage
    if (answer === "true" || answer === "false") {
        console.log("TF answer");
        user_answer = tf_answer;
    } else {
        // Get the user's selected multiple choice options
        user_answer = document.querySelector("input[name='quiz-option']:checked").value;
        console.log(user_answer)
        console.log(answer)
    }

    truefalse_area.style.display = "none";
    question_area.style.display = "none";
    result_area.style.display = "flex";

    // Correct answer
    if (user_answer === answer) {

        question_index++;
        levelUp(question_index);

        result_title.innerHTML = "<img src='images/result-correct.png'> Correct";
        result_body.innerHTML = "Congratulations, you know your stuff!";
        play_btn.style.display = "none";

        if (question_index <= numWeeks) {
            next_btn.style.display = "block";
        } else {
            next_btn.style.display = "none";
        }

    } else {
        result_title.innerHTML = "<img src='images/result-incorrect.png'> Incorrect";
        result_body.innerHTML = "Please review the following video and try again";
        play_btn.style.display = "block";
        next_btn.style.display = "none";
    }
}


function levelUp(question_index) {

    localStorage.setItem("currentQuestion", question_index);

    let user_progress = JSON.parse(localStorage.getItem("user_progress"));
    let course = localStorage.getItem("course");
    let next_index = parseInt(user_progress[course]) + 1

    user_progress[course] = next_index;
    localStorage.setItem("user_progress", JSON.stringify(user_progress));

}

function playVideo() {

    let quiz = JSON.parse(localStorage.getItem("data"));
    let numWeeks = parseInt(localStorage.getItem("numWeeks"));
    let index = parseInt(localStorage.getItem("currentQuestion"));

    // Hide the question area
    let question_area = document.querySelector(".question-area");
    question_area.style.display = "none";

    let truefalse_area = document.querySelector(".truefalse-area");
    truefalse_area.style.display = "none";

    let result_area = document.querySelector(".result");
    result_area.style.display = "none";

    // Load and Show the video player
    let video_player = document.getElementById("video-player");
    let video_source = document.getElementById("video-source");

    video_player.style.display = "block";

    video_player.pause();
    video_source.src = "https://microlearningvideos.s3.amazonaws.com/" + quiz[0]["quiz"][index]["video"];
    video_player.load();

    video_player.play()

    video_player.addEventListener("ended", function() {

        this.pause();

        // Hide the video player
        video_player.style.display = "none";

        showQuestion();
    })
}

function processDragDropOrderAnwers() {

    // Get the JSON data
    let quiz = JSON.parse(localStorage.getItem("data"));

    // Make sure we have the current question
    let index = parseInt(localStorage.getItem("currentQuestion"));

    // Let's save the answers to arrays first
    let answers = quiz[0]["quiz"][index]["answer_column_a"];

    // Check both Drag & Drop column divs to see which children elements are inside it.
    // This lets us see what divs have been dragged into them by the user
    let order_1 = document.getElementById("order-1");
    let order_2 = document.getElementById("order-2");
    let order_3 = document.getElementById("order-3");
    let order_4 = document.getElementById("order-4");
    let order_area = document.querySelector(".order-area")

    let orderCollection = [order_1,order_2,order_3,order_4];

    let counter_a = 0;
    // Loop through each div that's inside Column A
    for (let i = 0; i < orderCollection.length; ++i) {
        // Check to see if the current item is contained in our answers array
        if (answers.includes(orderCollection[i].innerHTML)) {
            // Increment for a correct answer
            counter_a++;
        } else {
            counter_a--;
        }
    }

    // Show results based on correct or incorrect
    // Get all elements ready for showing results
    let result_area = document.querySelector(".result");
    let result_title = document.querySelector(".result-title");
    let result_body = document.querySelector(".result-body");
    let dragdrop_area = document.querySelector(".dragdrop-area");
    let play_btn = document.getElementById("play-btn");
    let next_btn = document.getElementById("next-btn");
    let numWeeks = parseInt(localStorage.getItem("numWeeks"));

    // Hide the order-area & show the results area
    result_area.style.display = "flex";
    order_area.style.display = "none";


    if (counter_a === 4) {
        // All items are in the correct column
        index++;
        localStorage.setItem("currentQuestion", index);
        levelUp(index);

        result_title.innerHTML = "Correct";
        result_body.innerHTML = "Congratulations, you know your stuff!";
        play_btn.style.display = "none";

        if (question_index <= numWeeks) {
            next_btn.style.display = "block";
        } else {
            next_btn.style.display = "none";
        }

    } else {
        result_title.innerHTML = "Incorrect";
        result_body.innerHTML = "Please review the following video and try again";
        play_btn.style.display = "block";
        next_btn.style.display = "none";    }
}


function processDragDropAnwers() {
    
    // Get the JSON data
    let quiz = JSON.parse(localStorage.getItem("data"));

    // Make sure we have the current question
    let index = parseInt(localStorage.getItem("currentQuestion"));

    // Let's save the answers to arrays first
    let answers_column_a = quiz[0]["quiz"][index]["answer_column_a"];
    let answers_column_b = quiz[0]["quiz"][index]["answer_column_b"];

    // Check both Drag & Drop column divs to see which children elements are inside it.
    // This lets us see what divs have been dragged into them by the user
    let col_a = document.getElementsByClassName("col-a");
    let col_b = document.getElementsByClassName("col-b");

    let counter_a = 0;
    // Loop through each div that's inside Column A
    for (let i = 0; i < col_a.length; ++i) {
        // Check to see if the current item is contained in our answers array
        if (answers_column_a.includes(col_a[i].innerHTML)) {
            // Increment for a correct answer
            counter_a++;
        } else {
            counter_a--;
        }
    }
    // let referenceA = document.getElementById("dd-item-1")
    // let answerColumnA = document.getelementbyID("answers-column-a");
    // if (answerColumnA === document.querySelectorAll("tpCont").querySelector("#tp1")))
    // if this drop zone containes performanve planning good continue to check the next; 4 drop zones in rows stacked

    // Loop thru column B and do the same as above
    let counter_b = 0;
    for (let i = 0; i < col_b.length; ++i) {
        if (answers_column_b.includes(col_b[i].innerHTML)) {
            counter_b++;
        } else {
            counter_b--;
        }
    }

    // Show results based on correct or incorrect
    // Get all elements ready for showing results
    let result_area = document.querySelector(".result");
    let result_title = document.querySelector(".result-title");
    let result_body = document.querySelector(".result-body");
    let dragdrop_area = document.querySelector(".dragdrop-area");
    let play_btn = document.getElementById("play-btn");
    let next_btn = document.getElementById("next-btn");
    let numWeeks = parseInt(localStorage.getItem("numWeeks"));
   
    // Hide the drag-drop area & show the results area
    result_area.style.display = "flex";
    dragdrop_area.style.display = "none";


    if (counter_a === 3 && counter_b === 3) {
        // All items are in the correct column
        index++;
        localStorage.setItem("currentQuestion", index);
        levelUp(index);

        result_title.innerHTML = "Correct";
        result_body.innerHTML = "Congratulations, you know your stuff!";
        play_btn.style.display = "none";

        if (question_index <= numWeeks) {
            next_btn.style.display = "block";
        } else {
            next_btn.style.display = "none";
        }

    } else {
        result_title.innerHTML = "Incorrect";
        result_body.innerHTML = "Please review the following video and try again";
        play_btn.style.display = "block";
        next_btn.style.display = "none";    }
}

function checkboxMultipleChoice(){
    // Get the JSON data
    let quiz = JSON.parse(localStorage.getItem("data"));

    // Make sure we have the current question
    let index = parseInt(localStorage.getItem("currentQuestion"));

    // Let's save the answers 
    let answers = quiz[0]["quiz"][index]["answer"];
    

    // let but = document.getElementById("button")
    // but.addEventListener('click',clicked)
    let result_area = document.querySelector(".result");
    let result_title = document.querySelector(".result-title");
    let result_body = document.querySelector(".result-body");
    let cbmultiple_choice= document.querySelector(".cbquestion-area");
    let play_btn = document.getElementById("play-btn");
    let next_btn = document.getElementById("next-btn");
    let numWeeks = parseInt(localStorage.getItem("numWeeks"));
    
    //function for checkbox mc 
    let count = 0
    let check_num = 0
    let questA= document.getElementById("cb-a");
    let questB= document.getElementById("cb-b");
    let questC= document.getElementById("cb-c");
    let questD= document.getElementById("cb-d");
    console.log(answers)
    if (questA.checked == true){
        check_num = check_num + 1
        if(answers.includes(questA.value)){
            count = count + 1
        }
    }
    if (questB.checked == true){
        check_num = check_num + 1
        if(answers.includes(questB.value)){
            count = count + 1
        }  
    }
    if (questC.checked == true){
        check_num = check_num + 1
        if(answers.includes(questC.value)){
            count = count + 1
        } 
    }
    if (questD.checked == true){
        check_num = check_num + 1
        if(answers.includes(questD.value)){
            count = count + 1
        }
    }
    // console.log(count)
    // Hide the drag-drop area & show the results area
    result_area.style.display = "flex";
    cbmultiple_choice.style.display = "none";

    //if you have the answer correct
    if (count === answers.length && check_num === answers.length){
        console.log('you got it')
        index++;
        localStorage.setItem("currentQuestion", index);
        levelUp(index);

        result_title.innerHTML = "Correct";
        result_body.innerHTML = "Congratulations, you know your stuff!";
        play_btn.style.display = "none";

        if (question_index <= numWeeks) {
            next_btn.style.display = "block";
        } else {
            next_btn.style.display = "none";
        }

    } else {
        result_title.innerHTML = "Incorrect";
        result_body.innerHTML = "Please review the following video and try again";
        play_btn.style.display = "block";
        next_btn.style.display = "none";    }
    }


function getUserProgress() {

    if (localStorage.getItem("user_progress") === "" || localStorage.getItem("user_progress") === null || localStorage.getItem("user_progress") === "undefined") {
        console.log("Hi?")
        let progress = {
            "performance":0,
            "budgets":0,
            "devops":0,
            "culture":0,
            "stress":0,
        }
        localStorage.setItem("user_progress", JSON.stringify(progress))
        console.log(progress)
    }

    let course = localStorage.getItem("course");
    let user_progress = JSON.parse(localStorage.getItem("user_progress"));
    console.log(course)
    console.log(user_progress)

    localStorage.setItem("currentQuestion", user_progress[course]);
}

function main() {

    // Access the video player elements
    let video_source = document.getElementById("video-source");
    let video_player = document.getElementById("video-player");

    // Access the Sound toggle button
    let soundBtn = document.getElementById("audio-button");

    // Access the output areas
    let question_area = document.querySelector(".question-area");
    let question_title = document.querySelector(".question-title");

    // Make sure the video player & sound button is hidden when the page first loads
    video_player.style.display = "none";
    soundBtn.style.display = "none";

    // Make sure the question area is visible
    question_area.style.display = "flex";

    // Setup the True or False buttons
    let trueBtn = document.getElementById("btn-true");
    let falseBtn = document.getElementById("btn-false");

    trueBtn.addEventListener("click", function() {
        localStorage.setItem("tf_answer", "true");
    });

    falseBtn.addEventListener("click", function() {
        localStorage.setItem("tf_answer", "false");
    });

    // Setup the submit answer buttons
    let submitBtn = document.getElementById("submit-answer");
    submitBtn.addEventListener("click", processAnswer);    

    // Setup the submit button for true/false
    let submitTFBtn = document.getElementById("submit-tfanswer");
    submitTFBtn.addEventListener("click", processAnswer);

    // Setup the play button & next button for the video-player
    let play_btn = document.getElementById("play-btn");
    play_btn.display="none";
    play_btn.addEventListener("click", playVideo)

    let home_btn = document.getElementById("home-btn");
    home_btn.display="none";
    home_btn.addEventListener("click", function() {
        window.location.href = "/home";
    });

    let next_btn = document.getElementById("next-btn");
    next_btn.display="none";
    next_btn.addEventListener("click", function() {

        let currentQuestion = parseInt(localStorage.getItem("currentQuestion"));
        console.log(currentQuestion)

        let question_area = document.querySelector(".question-area");
        let result_area = document.querySelector(".result");

        result_area.style.display = "none";
        question_area.style.display = "flex";
        showQuestion();
    });

    // Setup the Drag & Drop submit button
    let dd_submit_btn = document.getElementById("dd-submit-btn");
    dd_submit_btn.addEventListener("click", function() {
        processDragDropAnwers();
    });
    //setup the checkbox MC Submit Button
    let checkbox_submit_answer = document.getElementById("cb-submit-answer")
    checkbox_submit_answer.addEventListener("click", function(){
        checkboxMultipleChoice();
    })
    //setup the Sequence Order Submit Button
    let sequenceOrder_submit_answer = document.getElementById("order-submit-btn")
    sequenceOrder_submit_answer.addEventListener("click", function(){
        processDragDropOrderAnwers()();
    })
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

    let lo_form = document.querySelector("#logout_form")
    let lo_clickable = lo_form.querySelector("p");
    lo_clickable.addEventListener('click', ()=>{
        lo_form.submit();
    })


    // Fetch some JSON data yo!
    fetchJSONData();

}

window.addEventListener("load", main);