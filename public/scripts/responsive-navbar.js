let mobileViewIconContainer = document.querySelector('.mobile-view-icon');
const menuBtn = document.querySelector('.hamburger-menu');
const cancelBtn = document.querySelector('cancel-icon');
const navbar = document.querySelector('.navbar');
mobileViewIconContainer.addEventListener('click',()=>{
    menuBtn.classList.toggle('.hidden');
    cancelBtn.classList.toggle('.hidden');
    //something related to navbar must be done
});