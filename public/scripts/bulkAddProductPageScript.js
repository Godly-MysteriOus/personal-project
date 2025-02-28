// suggestions generate handler
async function loadSuggestionData(val){
    if(val.length<=0){
        suggesstions.classList.add('suggestionBox-hidden');
        return;
    }
    // retreives data from lcoalstorage for key
    const suggesstionList = JSON.parse(localStorage.getItem(keyName));
    //filters data according to searchInput Data
    let desiredSuggesstionList = suggesstionList.filter(item=>String(item?.name).toLowerCase().includes(val.toLowerCase())).sort((a,b)=> a.name.localeCompare(b.name));
    if(desiredSuggesstionList.length<5){
        // make a api call to fetch and store data in local storage
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
        desiredSuggesstionList =  result.data.filter(item => String(item.name).toLowerCase().includes(val.toLowerCase())).sort((a,b)=> a.name.localeCompare(b.name));
    }
    // show 10 data to the UI
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
searchInputField.addEventListener('input',async(e)=>{
    const val = String(searchInputField.value);
    loadSuggestionData(val);
});