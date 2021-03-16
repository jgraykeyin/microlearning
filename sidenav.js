function openNav() {
  const openNav = document.querySelector("#click");
  const sideNav = document.querySelector("#sidenav");
  const closeNav = document.querySelector('.closebtn');
  openNav.addEventListener('click', function () {
    console.log("you clicked!");
    sideNav.style.width = "250px";
  })
  closeNav.addEventListener('click', function () {
    sideNav.style.width = "0px";
  })

}








window.addEventListener('load', openNav)