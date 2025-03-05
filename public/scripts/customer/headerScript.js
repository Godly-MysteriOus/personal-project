const moreFeatureBtnHolder = document.querySelector('.moreFeatureBtnHolder');
const featureBtnCss = 'featureBtnHidden';
const menuBtnHolder = document.querySelector('.menuBtnHolder');
const closeBtnHolder = document.querySelector('.closeBtnHolder');
moreFeatureBtnHolder.addEventListener('click',(e)=>{
    menuBtnHolder.classList.toggle(featureBtnCss);
    closeBtnHolder.classList.toggle(featureBtnCss);
});