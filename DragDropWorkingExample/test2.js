let draggable = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container")

draggable.forEach(draggable => {
    draggable.addEventListener('touchstart', () => {
        draggable.classList.add('dragging')
        console.log('drag start')
    })
    draggable.addEventListener('touchend', () => {
        draggable.classList.remove('dragging')
    })
})

containers.forEach(container => {
    container.addEventListener('touchmove', (e) => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        container.appendChild(draggable)
        if (afterElement == null) {
            container.appendChild(draggable)
        }else{
            container.insertBefore(draggable, afterElement)
        }
        
    })
})


function getDragAfterElement(container, y, ){
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        
        
        if (offset < 0 && offset > closest.offset){
            return { offset: offset, element: child }
        }else{
            return closest
        }
    },{offset: Number.NEGATIVE_INFINITY }).element
}

function submit(){
    if (document.getElementById("tpCont").querySelector("#tp1") &&
        document.getElementById("tpCont").querySelector("#tp2") && 
        document.getElementById("tpCont").querySelector("#tp3") &&
        document.getElementById("epCont").querySelector('#ep4') &&
        document.getElementById("epCont").querySelector('#ep5') &&
        document.getElementById("epCont").querySelector('#ep6')) {
        console.log('yup')
    } else {
        console.log('nope')
    }
}




// window.addEventListener("load", dragdrop);