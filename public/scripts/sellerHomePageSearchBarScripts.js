
// searchbar suggesstion and get all product button
/*
const searchInputField = document.querySelector('.searchInput');
const suggesstions = document.querySelector('.suggestionBox');
const medicineIdValue = document.querySelector('.medicineId');

-------------- already declared in searchBox -------------------------
*/
const getAllProductBtn = document.querySelector('.getAllProductBtn');
const searchButton = document.querySelector('.searchBtn');
const suggestionBox = document.querySelector('.suggestionBox');
//  generate Suggesstion
function loadSuggestionData(inputData){
    // dont process suggestion list and show suggesstions when input size is null
    if(inputData.value<=0){
        suggestionBox.classList.add('suggestionBox-hidden');
        return;
    }
    const listedProductList = localStorage.getItem(keyName) ? JSON.parse(localStorage.getItem(keyName)) : [];
    //suggesstionList stores the data matching the input value in a sorted order
    let suggesstionList  = [];
    suggesstionList =  listedProductList.filter(item=>String(item.name).toLowerCase().includes(inputData.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name));
    // this is implemented to first get data where medicine name starts with input value followed by data in sorted order
    let sortedSuggestionList = [];
    suggesstionList.forEach(item => {
        if(String(item.name).toLowerCase().startsWith(inputData.toLowerCase())){
            sortedSuggestionList.push(item);
        }
    });
    suggesstionList.forEach(item=>{
        if(!sortedSuggestionList.find(product=>product.name == item.name)){
            sortedSuggestionList.push(item);
        }
    })
    if(suggesstionList.length==0){
        suggesstionList.push({name:'No Item Present',productId:''});
    }
    //defines maximum iteration and creates option
    const maxIteration = sortedSuggestionList.length > 10 ? 10 : sortedSuggestionList.length;
    suggestionBox.classList.remove('suggestionBox-hidden');
    suggestionBox.innerHTML = '';
    for(let i=0; i<maxIteration; i++){
        const option = document.createElement('option');
        option.textContent = sortedSuggestionList[i].name;
        option.value = sortedSuggestionList[i].productId;
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

searchButton.addEventListener('click',async()=>{
    const response = await fetch(url+'seller/search-listed-product',{
        method:'POST',
        headers:{ 'Content-Type': 'application/json' },
        body:JSON.stringify({
            medicineId: medicineIdValue.value,
        }),
    });
    const contentType = response.headers.get('content-type');
    if(contentType && contentType.includes('application/json')){
        const result = await response.json();
        message.textContent = result.message;
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add('message-hidden');
        },3000);
    }else{
        if(response.redirected){
            window.location.href = url + redirect;
        }else{
            const result = await response.text();
            searchInputField.value='';
            medicineIdValue.value = '';
            const bodyWrapper = document.querySelector('.body-wrapper');
            bodyWrapper.innerHTML = result;
            attachEventListner();
            document.querySelector('.paginationHolder').style.display = 'none';
        }
    }
});