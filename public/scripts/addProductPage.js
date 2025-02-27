 /*
    const searchInputField = document.querySelector('.searchInput');
    const suggesstions = document.querySelector('.suggestionBox');
    const medicineIdValue = document.querySelector('.medicineId');

    -------------- already declared in searchBox -------------------------
    */
    const addBtnSearchBox = document.querySelector('.addBtn');
    const resetBtn = document.querySelector('.reset');
    const submitBtn = document.querySelector('.submit');
   //fields
    const productName = document.querySelector('.productName');
    const productManufacturer = document.querySelector('.productManufacturer');
    const productPackagingInfo = document.querySelector('.productPackagingInfo');
    const productType = document.querySelector('.productType');
    const productUsage = document.querySelector('.productUsage');
    const originalPrice = document.querySelector('.originalPrice');
    const productImage = document.querySelector('.productImage');
    const offeredPrice = document.querySelector('.offeredPrice');
    const quantity = document.querySelector('.productQuantity');

    function quantityVerification(quantity){
        if(Number(quantity)<=0){
            message.textContent = 'Quantity cannot be less than 1';
            message.classList.remove('message-hidden');
            setTimeout(()=>{
                message.classList.add('message-hidden');
            },3000);
            return;
        }
    }
    quantity.addEventListener('blur',(e)=>{
        quantityVerification(quantity.value);
    });
    function Price(offerPrice){
        if(offerPrice!=undefined && Number(originalPrice.value)!=undefined && Number(originalPrice.value)!=0 && Number(offerPrice)>Number(originalPrice.value)){
            message.textContent = 'Offered Price should not be greater than MRP';
            message.classList.remove('message-hidden');
            setTimeout(()=>{
                message.classList.add('message-hidden');
            },3000);
            return;
        }
    }
    offeredPrice.addEventListener('blur',(e)=>{
        Price(offeredPrice.value);
    });
   addBtnSearchBox.addEventListener('click',async(e)=>{
        quantity.value='';
        offeredPrice.value='';
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
        if(result.success){
            const data = result.data;
            productName.textContent = data.name;
            productManufacturer.textContent = data.manufacturer;
            productPackagingInfo.textContent = data.packagingDetails;
            productType.textContent = data.productForm;
            productUsage.textContent = data.useOf.split('|')[0];
            originalPrice.value = data.MRP;
            offeredPrice.value = data.MRP;
            productImage.setAttribute('src',data.productImage.split('|')[0]);
        }else{
            message.textContent = result.message;
            message.classList.remove('message-hidden');
            setTimeout(()=>{
                message.classList.add('message-hidden');
            },3000);
        }
   });
   //reset button
   resetBtn.addEventListener('click',(e)=>{
        productName.textContent = '';
        productManufacturer.textContent = '';
        productPackagingInfo.textContent = '';
        productType.textContent = '';
        productUsage.textContent = '';
        productImage.setAttribute('src','');
   });
   //submit form button
   submitBtn.addEventListener('click',async(e)=>{
        // if you set the offered price and it is greater than original price throw an error
        Price(offeredPrice.value);
        // quantityVerification
        quantityVerification(quantity.value);
        // landing here means either offered price is undefined or less than MRP

        //if offered price is Null set price as MRP else set price as offered Price
        const medicinePrice = (Number(offeredPrice.value)==undefined|| Number(offeredPrice.value==0)) ? Number(originalPrice.value) : Number(offeredPrice.value);  

        const response = await fetch(url+'seller/add-product',{
            method:'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId : medicineIdValue.value,
                quantity : Number(quantity.value),
                originalPrice : Number(originalPrice.value),
                price : Number(medicinePrice),
            }),
        });
        const result = await response.json();
        if(result.success){
            productName.textContent = '';
            productManufacturer.textContent = '';
            productPackagingInfo.textContent = '';
            productType.textContent = '';
            productUsage.textContent = '';
            productImage.setAttribute('src','');
            originalPrice.value = '';
            offeredPrice.value = '';
            quantity.value = '';
            searchInputField.value='';
        }
        message.textContent = result.message;
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add('message-hidden');
        },3000);
   });

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
})