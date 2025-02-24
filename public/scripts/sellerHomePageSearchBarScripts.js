
// searchbar suggesstion and get all product button
/*
const searchInputField = document.querySelector('.searchInput');
const suggesstions = document.querySelector('.suggestionBox');
const medicineIdValue = document.querySelector('.medicineId');

-------------- already declared in searchBox -------------------------
*/
const getAllProductBtn = document.querySelector('.getAllProductBtn');
const suggestionBox = document.querySelector('.suggestionBox');
//  generate Suggesstion
function loadSuggestionData(inputData){
    // dont process suggestion list and show suggesstions when input size is null
    if(inputData.valye<=0){
        suggestionBox.classList.add('suggestionBox-hidden');
        return;
    }
    const listedProductList = JSON.parse(localStorage.getItem(keyName));
    let suggesstionList  = [];
    suggesstionList =  listedProductList.filter(item=>String(item.name).toLowerCase().includes(inputData.toLowerCase()));
    if(suggesstionList.length==0){
        suggesstionList.push({name:'No Item Present',productId:''});
    }
    const maxIteration = suggesstionList.length > 10 ? 10 : suggesstionList.length;
    suggestionBox.classList.remove('suggestionBox-hidden');
    suggestionBox.innerHTML = '';
    for(let i=0; i<maxIteration; i++){
        const option = document.createElement('option');
        option.textContent = suggesstionList[i].name;
        option.value = suggesstionList[i].productId;
        option.classList.add('optionField');
        suggestionBox.appendChild(option);
    }
}
searchInputField.addEventListener('input',async(e)=>{
    const inputData = String(searchInputField.value);
    loadSuggestionData(inputData);
});
// shows all product
getAllProductBtn.addEventListener('click',async(e)=>{
    window.location.href = url+'seller/listed-products';
});
