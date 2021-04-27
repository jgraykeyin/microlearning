function homepage(){
  let ham = document.querySelector(".hamburger-btn");
  ham.addEventListener('click', showSideBar);
  let lo_form = document.querySelector("#logout_form")
  let lo_clickable = lo_form.querySelector("p");
  lo_clickable.addEventListener('click', ()=>{
      lo_form.submit();
  })


}

function showSideBar(){
  const max_width = "320px";
  sidenav = document.querySelector(".sidenav")
  if (sidenav.style.width === max_width) {
      sidenav.style.width = "0px";
  } else {
      sidenav.style.width = max_width
  }
}









window.addEventListener('load', homepage)