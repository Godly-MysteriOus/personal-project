const searchBtn = document.querySelector('.searchBtn');
const contentHolder = document.querySelector('.contentHolder');
searchBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    const response = await fetch(url+'customer/homePage-search-product',{
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
      
    }else{
        const result = await response.text();
        contentHolder.innerHTML = result;
    }
});