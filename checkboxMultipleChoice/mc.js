function main(){
    let but = document.getElementById("button")
    but.addEventListener('click',clicked)
    let answers = ["a","b"]
    
    function clicked(){
        let count = 0
        let check_num = 0
        let questA= document.getElementById("a")
        let questB= document.getElementById("b")
        let questC= document.getElementById("c")
        let questD= document.getElementById("d")
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

        if (count === answers.length && check_num === answers.length){
            console.log('you got it')
        }
        // console.log(count)
    }
}
window.addEventListener('load', main)

