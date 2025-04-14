const searchBtn = document.querySelector('.searchBtn');
const contentHolder = document.querySelector('.contentHolder');
searchBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    const response = await fetch(url+'customer/search-product',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            medicineId: medicineIdValue.value,
        }),
    });
    const contentType = response.headers.get('content-type');
    if(contentType && contentType == 'application/json'){
        const result = await response.json();
        message.textContent = result.message;
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add("message-hidden");
        },3000);
      
    }else if(response.redirected){
        window.location.href = url + redirect;
    }else{
        
        const result = await response.text();
        contentHolder.innerHTML = result;
    }
});
detailAndAddToCartScript();
window.addEventListener('load',async(e)=>{
    const response = await fetch(url+'customer/user-addresses',{
        method: 'GET',
    });
    const result = await response.json();
    if(result.data.length==0){
        setTimeout(()=>{
            addAddressContainer.classList.remove('hideAddAddressPopup');
            addAddressContainer.style.animation = 'showPopup 1s ease-in-out';
        },1000);
    }
    // if its length is 0, show the addAddressPopup
});