function main(){
    let but = document.getElementById("button")
    but.addEventListener('click',clicked)
    let answers = ["a","b"]
    
    function clicked(){
        let count = 0
        let questA= document.getElementById("a")
        let questB= document.getElementById("b")
        let questC= document.getElementById("c")
        let questD= document.getElementById("d")
        if (questA.checked == true){
            if(answers.includes(questA.value)){
                console.log("triggered if A")
                count = count + 1
            }
        }
        if (questB.checked == true){
            if(answers.includes(questB.value)){
                console.log("triggered if B")
                count = count + 1
            }  
        }
        if (questC.checked == true){
            if(answers.includes(questC.value)){
                console.log("triggered if C")
                count = count + 1
            } 
        }
        if (questD.checked == true){
            if(answers.includes(questD.value)){
                console.log("triggered if D")
                count = count + 1
            }
        }

        if (count === answers.length){
            console.log('you got it')
        }
        console.log(count)


    }
}


window.addEventListener('load', main)

"if(!this.form.a.checked){alert('correct');return false}"