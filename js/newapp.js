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

    let yt_area = document.querySelector(".youtube-area");
    yt_area.style.display = "none";
    
    // Get the current question title
    let question = quiz[0]["quiz"][index]["question"];
    let order_area = document.querySelector(".order-area")
    let question_area = document.querySelector(".question-area");
    let truefalse_area = document.querySelector(".truefalse-area");
    let match_area = document.querySelector(".match-area")
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
    let match_title = document.querySelector(".match-title")
    
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
        match_area.style.display = "none";
        result_title.innerHTML = "All done";
        result_body.innerHTML = "Check back next week for another question.";
        play_btn.style.display = "none";
        next_btn.style.display = "none";

    } else if (index >= 20) {
        
        let result_area = document.querySelector(".result");
        let result_title = document.querySelector(".result-title");
        let result_body = document.querySelector(".result-body");

        let play_btn = document.getElementById("play-btn");
        let next_btn = document.getElementById("next-btn");

        truefalse_area.style.display = "none";
        question_area.style.display = "none";
        result_area.style.display = "flex";
        order_area.style.display = "none"
        match_area.style.display = "none";
        result_title.innerHTML = "Course Complete!";
        result_body.innerHTML = "Congratulations, you've completed the course!";
        play_btn.style.display = "none";
        next_btn.style.display = "none";

    } else if (quiz[0]["quiz"][index]["true"]) {
        // This is a the true-false questions
        truefalse_area.style.display = "flex";
        checkbox_area.style.display = "none"
        question_area.style.display = "none";
        dragdrop_area.style.display = "none";
        match_area.style.display = "none";
        order_area.style.display = "none"
        truefalse_title.innerHTML = quiz[0]["quiz"][index]["question"];

    } else if (quiz[0]["quiz"][index]["sequence"]){
        //This is a sequence order questions
        console.log("Order")
        order_area.style.display = "flex";
        console.log(order_area)
        truefalse_area.style.display = "none";
        question_area.style.display = "none";
        checkbox_area.style.display = "none"
        match_area.style.display = "none";
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


    } else if (quiz[0]["quiz"][index]["type"]){
        //This is a match drag drop question
        order_area.style.display = "none"
        truefalse_area.style.display = "none";
        question_area.style.display = "none";
        checkbox_area.style.display = "none"
        dragdrop_area.style.display = "none";
        match_area.style.display = "flex";
        match_title.innerHTML = quiz[0]["quiz"][index]["question"];

        let match_1 = document.getElementById("match-1");
        let match_2 = document.getElementById("match-2");
        let match_3 = document.getElementById("match-3");
        let match_4 = document.getElementById("match-4");
        let match_5 = document.getElementById("match-5");

        let matched_1 = document.getElementById("answered-match-a");
        let matched_2 = document.getElementById("answered-match-b");
        let matched_3 = document.getElementById("answered-match-c");
        let matched_4 = document.getElementById("answered-match-d");
        let matched_5 = document.getElementById("answered-match-e");

        match_1.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][0];
        match_2.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][1];
        match_3.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][2];
        match_4.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][3];
        match_5.innerHTML = quiz[0]["quiz"][index]["answer_column_a"][4];

        matched_1.innerHTML = quiz[0]["quiz"][index]["answer_column_b"][0];
        matched_2.innerHTML = quiz[0]["quiz"][index]["answer_column_b"][1];
        matched_3.innerHTML = quiz[0]["quiz"][index]["answer_column_b"][2];
        matched_4.innerHTML = quiz[0]["quiz"][index]["answer_column_b"][3];
        matched_5.innerHTML = quiz[0]["quiz"][index]["answer_column_b"][4];
        console.log(quiz[0]["quiz"][index]["answer_column_b"][0])
    
    }else if (quiz[0]["quiz"][index]["heading_a"]) {
        // This is a drag drop question

        truefalse_area.style.display = "none";
        question_area.style.display = "none";
        checkbox_area.style.display = "none"
        match_area.style.display = "none";
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
        //This is a checkbox multiple choice question
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
        user_answer = tf_answer;
    } else {
        // Get the user's selected multiple choice options
        user_answer = document.querySelector("input[name='quiz-option']:checked").value;

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

    // Send the course name and user progress back to our Node server so it can be inserted into MySQL
    let xhr = new XMLHttpRequest();
    xhr.open("POST", '/correct', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
        }
    }
    xhr.send(`course=${course}&progress=${next_index}`);

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

    if (quiz[0]["quiz"][index]["youtube"]) {

        let yt_area = document.querySelector(".youtube-area");
        yt_area.style.display = "flex";

        let yt_player = document.getElementById("youtube-frame");
        yt_player.src = `${quiz[0]["quiz"][index]["youtube"]}`

        yt_button = document.getElementById("youtube-done");
        yt_button.addEventListener("click", showQuestion);

    } else {

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
        });
    }
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
    let order_area = document.querySelector(".order-area")
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

        let dditem1 = document.getElementById("order-1");
        let dditem2 = document.getElementById("order-2");
        let dditem3 = document.getElementById("order-3");
        let dditem4 = document.getElementById("order-4");
        
        dditem1.remove();
        dditem2.remove();
        dditem3.remove();
        dditem4.remove();

        result_title.innerHTML = "Correct";
        result_body.innerHTML = "Congratulations, you know your stuff!";
        play_btn.style.display = "none";

        if (index <= numWeeks) {
            next_btn.style.display = "block";
        } else {
            next_btn.style.display = "none";
        }

    } else {
        result_title.innerHTML = "Incorrect";
        result_body.innerHTML = "Please review the following video and try again";
        play_btn.style.display = "block";
        next_btn.style.display = "none";    
    }
}
function processDragDropMatchAnwers() {

    // Get the JSON data
    let quiz = JSON.parse(localStorage.getItem("data"));

    // Make sure we have the current question
    let index = parseInt(localStorage.getItem("currentQuestion"));

    // Let's save the answers to arrays first
    let answers = quiz[0]["quiz"][index]["answer_column_a"];

    // Check both Drag & Drop column divs to see which children elements are inside it.
    // This lets us see what divs have been dragged into them by the user
    let order_1 = document.getElementById("match-1");
    let order_2 = document.getElementById("match-2");
    let order_3 = document.getElementById("match-3");
    let order_4 = document.getElementById("match-4");
    let order_5 = document.getElementById("match-5");
    

    let orderCollection = [order_1,order_2,order_3,order_4,order_5];

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
    let match_area = document.querySelector(".match-area")
    let play_btn = document.getElementById("play-btn");
    let next_btn = document.getElementById("next-btn");
    let numWeeks = parseInt(localStorage.getItem("numWeeks"));

    // Hide the order-area & show the results area
    result_area.style.display = "flex";
    match_area.style.display = "none";


    if (counter_a === 5) {
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
        next_btn.style.display = "none";    
    }
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

    console.log(col_a);
    console.log(col_b)

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

        let dditem1 = document.getElementById("dd-item-1");
        let dditem2 = document.getElementById("dd-item-2");
        let dditem3 = document.getElementById("dd-item-3");
        let dditem4 = document.getElementById("dd-item-4");
        let dditem5 = document.getElementById("dd-item-5");
        let dditem6 = document.getElementById("dd-item-6");

        // Removing all the draggable items
        dditem1.classList.remove('col-a')
        dditem2.classList.remove('col-a')
        dditem3.classList.remove('col-a')
        dditem4.classList.remove('col-a')
        dditem5.classList.remove('col-a')
        dditem6.classList.remove('col-a')
        dditem1.classList.remove('col-b')
        dditem2.classList.remove('col-b')
        dditem3.classList.remove('col-b')
        dditem4.classList.remove('col-b')
        dditem5.classList.remove('col-b')
        dditem6.classList.remove('col-b')

        dditem1.remove();
        dditem2.remove();
        dditem3.remove();
        dditem4.remove();
        dditem5.remove();
        dditem6.remove();

        let item_area = document.querySelector(".dd-starting-items");

        let newitem1 = document.createElement("div");
        newitem1.classList.add("dd-item");
        newitem1.classList.add("drag-drop");
        newitem1.setAttribute("id", "dd-item-1");

        let newitem2 = document.createElement("div");
        newitem2.classList.add("dd-item");
        newitem2.classList.add("drag-drop");
        newitem2.setAttribute("id", "dd-item-2");

        let newitem3 = document.createElement("div");
        newitem3.classList.add("dd-item");
        newitem3.classList.add("drag-drop");
        newitem3.setAttribute("id", "dd-item-3");

        let newitem4 = document.createElement("div");
        newitem4.classList.add("dd-item");
        newitem4.classList.add("drag-drop");
        newitem4.setAttribute("id", "dd-item-4");

        let newitem5 = document.createElement("div");
        newitem5.classList.add("dd-item");
        newitem5.classList.add("drag-drop");
        newitem5.setAttribute("id", "dd-item-5");

        let newitem6 = document.createElement("div");
        newitem6.classList.add("dd-item");
        newitem6.classList.add("drag-drop");
        newitem6.setAttribute("id", "dd-item-6");

        item_area.appendChild(newitem1)
        item_area.appendChild(newitem2)
        item_area.appendChild(newitem3)
        item_area.appendChild(newitem4)
        item_area.appendChild(newitem5)
        item_area.appendChild(newitem6)


        if (index <= numWeeks) {
            next_btn.style.display = "block";
        } else {
            next_btn.style.display = "none";
        }

    } else {
        result_title.innerHTML = "Incorrect";
        result_body.innerHTML = "Please review the following video and try again";
        play_btn.style.display = "block";
        next_btn.style.display = "none";    
    }

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

        if (index <= numWeeks) {
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
        processDragDropOrderAnwers();
    })
    //setup the Match Order Submit Button
    let matchOrder_submit_answer = document.getElementById("match-submit-btn")
    matchOrder_submit_answer.addEventListener("click", function(){
        processDragDropMatchAnwers();
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