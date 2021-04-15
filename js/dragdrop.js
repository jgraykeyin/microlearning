function dragdrop() {
    console.log("Starting");
    
    let dragElement = document.querySelector("#draggable");

    dragElement.addEventListener("click", function() {
        console.log("Clicked");
    });

    /* events fired on the draggable target */
    document.addEventListener("drag", function(event) {

    }, false);

    document.addEventListener("dragstart", function(event) {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.style.opacity = .5;
    }, false);

    document.addEventListener("dragend", function(event) {
    // reset the transparency
    event.target.style.opacity = "";
    }, false);

}


window.addEventListener("load", dragdrop);