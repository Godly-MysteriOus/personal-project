async function apiCall(val){
    const response = await fetch(url+'utils/searchProduct',{
        method:'POST',
        headers : { 'Content-Type': 'application/json' },
        body:JSON.stringify({
            medicineName: val,
        }),
    });
    const result = await response.json();
    if(!result.success){
        message.textContent = result.message;
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add('message-hidden');
        },3000);
        return;
    }
    localStorage.setItem(keyName,JSON.stringify(result.data));
    //sorted data
   return result.data;
}
async function sortData(desiredSuggesstionList,val,retryAttempt){
    let sortedData = [];
    desiredSuggesstionList.forEach(item=>{
        if(String(item.name).toLowerCase().startsWith(val.toLowerCase())){
            sortedData.push(item);
        }
    });
    if(sortData.length==0 && retryAttempt >0){
        retryAttempt--;
        desiredSuggesstionList = await apiCall(val);
        await sortData(desiredSuggesstionList,val,retryAttempt);
    }
    desiredSuggesstionList.forEach(item=>{
        if(!sortedData.find(data => data.name == item.name)){
            sortedData.push(item);
        }
    });
    return sortedData;
}

async function loadSuggestionData(val){
    if(val.length<=0){
        suggesstions.classList.add('suggestionBox-hidden');
        return;
    }
    // retreives data from lcoalstorage for key
    const suggesstionList = localStorage.getItem(keyName) ? JSON.parse(localStorage.getItem(keyName)) : [];
    //filters data according to searchInput Data
    let desiredSuggesstionList = suggesstionList?.filter(item=>String(item?.name).toLowerCase().includes(val.toLowerCase()));
    desiredSuggesstionList = await sortData(desiredSuggesstionList,val,1);
    if(!desiredSuggesstionList || desiredSuggesstionList.length<7){
        //sorted data
        const apiData = await apiCall(val);
        desiredSuggesstionList =  apiData.filter(item => String(item.name).toLowerCase().includes(val.toLowerCase()));
    }
    // show 10 data to the UI
    desiredSuggesstionList = await sortData(desiredSuggesstionList,val,1);
    suggesstions.classList.remove('suggestionBox-hidden');
    suggesstions.innerHTML = '';
    const maxIteration = desiredSuggesstionList.length>10 ? 10 : desiredSuggesstionList.length;
    for(let i=0; i<maxIteration; i++){
        const option = document.createElement('option');
        option.textContent = desiredSuggesstionList[i].name;
        option.value = desiredSuggesstionList[i].productId;
        option.classList.add('optionField');
        suggesstions.appendChild(option);
    }
}
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}
const debouncedSearch = debounce((val) => {
    loadSuggestionData(val);
}, 400);
searchInputField.addEventListener('input',async(e)=>{
    const val = String(searchInputField.value);
    debouncedSearch(val);
});