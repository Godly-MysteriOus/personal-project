
function detailAndAddToCartScript(){
    contentHolder.addEventListener('click',async(e)=>{
        if(e.target.className == 'addToCart'){
            const inputClassName = e.target.closest('.addToCartButton').querySelector('.addToCartProductId').className.split(' ')[1];
            const domObj = document.querySelector(`.${inputClassName}`);
            const productId = domObj.value.split(' ')[0];
            const sellerId = domObj.value.split(' ')[1];
            const response = await fetch(url+'customer/add-to-cart',{
                method: 'POST',
                headers : {'Content-Type':'application/json'},
                body:JSON.stringify({
                    productId: productId,
                    sellerId: sellerId,
                }),
            });
            if(!response.headers.get('Content-Type').startsWith('text/html')){
                const result = await response.json();
                message.textContent = result.message;
                message.classList.remove('message-hidden');
                setTimeout(()=>{
                    message.classList.add('message-hidden');
                },3000);
            }else{
                window.location.href = url+'login';
            }
        }else if(e.target.className == 'detailsBtn'){
            const inputClassName = e.target.closest('.buttonHolder').querySelector('.detailsButtonProductId').className.split(' ')[1];
            console.log(inputClassName);
        }else{
            const savedAddressWrapper = document.querySelector('.savedAddressWrapper');
            if(!savedAddressWrapper.classList.contains('address-wrapper-hidden')){
                savedAddressWrapper.classList.add('address-wrapper-hidden')
            }
        }
    });
}