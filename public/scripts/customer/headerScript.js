const moreFeatureBtnHolder = document.querySelector('.moreFeatureBtnHolder');
const featureBtnCss = 'featureBtnHidden';
const menuBtnHolder = document.querySelector('.menuBtnHolder');
const closeBtnHolder = document.querySelector('.closeBtnHolder');
const navigationBarContentHolder = document.querySelector('.navigationBarContentHolder');
moreFeatureBtnHolder.addEventListener('click',(e)=>{
menuBtnHolder.classList.toggle(featureBtnCss);
    if(menuBtnHolder.classList.contains(featureBtnCss)){
        navigationBarContentHolder.classList.remove('navdisplay');
        navigationBarContentHolder.classList.remove('hideNavBar');
        navigationBarContentHolder.classList.add('displayNavBar')
    }
    closeBtnHolder.classList.toggle(featureBtnCss);
    if(closeBtnHolder.classList.contains(featureBtnCss)){
        navigationBarContentHolder.classList.add('hideNavBar');
        navigationBarContentHolder.classList.remove('displayNavBar');
        setTimeout(()=>{
            navigationBarContentHolder.classList.add('navdisplay');
        },350);
    }   
});
