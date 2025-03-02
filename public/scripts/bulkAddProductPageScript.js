// ======================    already defined in searchbox component   ==============================
// const searchInputField = document.querySelector('.searchInput');
// const suggesstions = document.querySelector('.suggestionBox');
// const medicineIdValue = document.querySelector('.medicineId');
const addBtnSearchBox = document.querySelector('.addBtn');
const gridContent = document.querySelector('.gridContent');
let index = -1;
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
        if(result.success && result.message=='Medicine Already Listed, will be updated !'){
            alert('Medicine Already Listed, will be updated. Quantity will be added up');
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
function loadPage(){
    let listedProductsToAdd = localStorage.getItem(addedBulkProductKeyName);
    listedProductsToAdd = listedProductsToAdd ? JSON.parse(listedProductsToAdd) : [];
    gridContent.innerHTML = '';
    listedProductsToAdd.forEach((item)=>{
        const tr = document.createElement('tr');
        const classNames = ['medicineName','manufacturer','packagingInfo','productForm','originalPrice','offeredPrice','quantity','deleteProduct'];
        const dataName = item.data;
        let tempIndex = ++index;
        classNames.forEach((val,i)=>{
            let td = document.createElement('td'); 
            td.className = `${val} ${val+'-'+tempIndex}`;
            if(i<=4){
                td.setAttribute('disabled',true);
                td.textContent = dataName[i];
            }
            else if(i>4 && i<=6){
                const input = document.createElement('input');
                input.value = dataName[i]; 
                input.className = `${val+'-'+tempIndex+'-input'} ${val+'-input'}`;
                input.type = 'number';
                td.appendChild(input);
            }
            else{
                const button = document.createElement('button');
                button.textContent = dataName[i];
                button.value = item.id;
                button.className = 'productId';
                button.type = "button";
                button.style.padding = '0.1rem 0.5rem';
                td.appendChild(button);
            }
            tr.appendChild(td);
        });
        gridContent.appendChild(tr);
    });
}
window.addEventListener('load',async(e)=>{
    // this is to load all the product you added, so even if you refresh by mistake you dont have to list them down all again
    loadPage();
});
addBtnSearchBox.addEventListener('click',async()=>{
  
    const suggesstionList = JSON.parse(localStorage.getItem(keyName));
    const abc = suggesstionList.find(item=>item.name==searchInputField.value);
    if(abc==undefined){
        message.textContent = 'Invalid Medicine Name. Cannot add product!';
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add('message-hidden');
        },3000);
        return;
    };
    const response  = await fetch(url+'seller/load-details',{
        method:'POST',
        headers:{ 'Content-Type': 'application/json' },
        body : JSON.stringify({
            medicineId: medicineIdValue.value,
        }),
    });
    const result = await response.json();
    if(result.success && result.message=='Medicine Already Listed, will be updated !'){
        message.textContent = result.message;
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add('message-hidden');
        },3000);
    }
    if(result.success){
        searchInputField.value = '';
        const tr = document.createElement('tr');
        const classNames = ['medicineName','manufacturer','packagingInfo','productForm','originalPrice','offeredPrice','quantity','deleteProduct'];
        const data = result.data;
        const dataName = [data.name,data.manufacturer.split('|')[0],data.packagingDetails.split('|')[0],data.productForm.split('|')[0],data.MRP,data.MRP,0,'Delete'];
        let tempIndex = ++index;
        classNames.forEach((val,i)=>{
            let td = document.createElement('td'); 
            td.className = `${val} ${val+'-'+tempIndex}`;
            if(i<=4){
                td.setAttribute('disabled',true);
                td.textContent = dataName[i];
            }
            else if(i>4 && i<=6){
                const input = document.createElement('input');
                input.value = dataName[i]; 
                input.type = 'number';
                input.className = `${val+'-'+tempIndex+'-input'} ${val+'-input'}`;
                td.appendChild(input);
            }
            else{
                const button = document.createElement('button');
                button.textContent = dataName[i];
                button.value = medicineIdValue.value;
                button.className = 'productId';
                button.type = "button";
                // button.style.padding = '0.25rem 0.5rem';
                td.appendChild(button);
            }
            tr.appendChild(td);
        });
        gridContent.appendChild(tr);
        const offeredPriceCurrentRow = document.querySelector(`.offeredPrice-${tempIndex}-input`);
        const quantityCurrentRow = document.querySelector(`.quantity-${tempIndex}-input`);
        const localStorageObj = {
            id: medicineIdValue.value,
            data : [data.name,data.manufacturer.split('|')[0],data.packagingDetails.split('|')[0],data.productForm.split('|')[0],data.MRP,offeredPriceCurrentRow.value,quantityCurrentRow.value,'Delete'],
        };
        let existingData = localStorage.getItem(addedBulkProductKeyName);
        existingData = existingData ? JSON.parse(existingData) : [];
        existingData.push(localStorageObj);
        localStorage.setItem(addedBulkProductKeyName,JSON.stringify(existingData));
    }else{
        message.textContent = result.message;
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add('message-hidden');
        },3000);
    }
});
document.addEventListener('click',(e)=>{
   if(e.target.matches('.productId')){
       const confirmationStatus = confirm('You are about to remove the product from this page.\nThis action is irreversible');
       if(confirmationStatus){
           const productToDelete = e.target.value;
           const allProducts = JSON.parse(localStorage.getItem(addedBulkProductKeyName));
           const newProduct = allProducts.filter(item=> item.id!=productToDelete);
           localStorage.setItem(addedBulkProductKeyName,JSON.stringify(newProduct));
           gridContent.removeChild(e.target.closest('tr'));
       }
   }
});

// save All Button functioality
/**
 * 1) create an array of product Id, MRP, set Price and quantity
 * 2) check whether MRP> set Price criteria is voilated
 * 3) check that quantity should not be less than 1
 * 4) On successful save, clear localstorage and update addBulkProduct Page
 */
const saveAllButton = document.querySelector('.saveAllButton');
saveAllButton.addEventListener('click',async(e)=>{
    e.preventDefault();
    //checks
    const productIds = document.querySelectorAll('.productId');
    const MRPs = document.querySelectorAll('.originalPrice');
    const setPrices = document.querySelectorAll('.offeredPrice-input');
    const quantity = document.querySelectorAll('.quantity-input');
    const medicineNames = document.querySelectorAll('.medicineName');
    const productIdList = [];
    const setPricesList = [];
    const quantityList = [];
    let i=0;
    for(i=0; i<productIds.length; i++){
        const item = productIds[i];
        if(item.value==''){
            alert('Invalid products listed to add');
            break;
        }
        if(Number(MRPs[i].textContent) < Number(setPrices[i].value)){
            alert('Your price cannot be greater than MRP, for Medicine = '+medicineNames[i].textContent);
            break;
        }
        if(Number(quantity[i].value<1)){
            alert('Quantity cannot be less than 1, Medicine : '+medicineNames[i].textContent);
            break;
        }
        if(isNaN(Number(setPrices[i].value)) || isNaN(Number(quantity[i].value))){
            alert('Only Number allowed in price and quantity field');
            break;
        }
        productIdList.push(item.value);
        setPricesList.push(Number(setPrices[i].value));
        quantityList.push(Number(quantity[i].value));
    };
    if(i!=productIds.length){
        return;
    }
    //make an API call
    message.textContent  = 'Please wait while we process your request';
    message.classList.remove('message-hidden');
    const response = await fetch(url+'seller/add-bulk-products',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            medicineIdList : productIdList,
            myPrice:setPricesList,
            quantity:quantityList,
        }),
    });
    const result = await response.json();
    message.textContent = result.message;
    setTimeout(()=>{
        message.classList.add('message-hidden');
    },3000);
    if(result.success){
        if(result.message == 'Added products successfully'){
            localStorage.removeItem(addedBulkProductKeyName);
            loadPage();
        }
    }
})