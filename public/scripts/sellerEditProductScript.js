
const cancelBtn = document.querySelector('.cancel');
const submitBtn = document.querySelector('.submit');
const productImage = document.querySelector('.productImage');
const productName = document.querySelector('.productName');
const productManufacturer = document.querySelector('.productManufacturer');
const productPackagingInfo = document.querySelector('.productPackagingInfo');
const productType = document.querySelector('.productType');
const productUsage = document.querySelector('.productUsage');
const originalPrice = document.querySelector('.originalPrice');
const offeredPrice = document.querySelector('.offeredPrice');
const quantity = document.querySelector('.productQuantity');

cancelBtn.addEventListener('click',(e)=>{
    window.close();
});


offeredPrice.addEventListener('blur',()=>{
    const mrp = Number(originalPrice.value);
    if(Number(offeredPrice.value)<=0 || Number(offeredPrice.value)>mrp){
        if(Number(offeredPrice.value)<=0){
            message.textContent = 'Price cannot be negative';
        }else{
            message.textContent = 'Price Cannot be greater then MRP'
        }
        submitBtn.setAttribute('disabled',true);
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add("message-hidden");
        },3000);
    }else{
        submitBtn.removeAttribute('disabled');
    }
});

quantity.addEventListener('blur',()=>{
    const val = Number(quantity.value);
    if(val<=0){
        message.textContent = 'Quantity cannot be less than 1';
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add('message-hidden');
        },3000);
        submitBtn.setAttribute('disabled',true);
    }else{
        submitBtn.removeAttribute('disabled');
    }
});

async function loadProductDetail() {
    let prodId = window.location.href.split('/');
    prodId = prodId.pop();
    const response = await fetch(url+`seller/edit-product-detail/${prodId}`,{
        method:'GET',
        headers:{ 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if(result.success){
        productImage.setAttribute('src',result.productDetail.productImage.split('|')[0]);
        productName.textContent = result.productDetail.name;
        productManufacturer.textContent = result.productDetail.manufacturer.split('|')[0];
        productPackagingInfo.textContent = result.productDetail.packagingDetails.split('|')[0];
        productType.textContent = result.productDetail.productForm.split('|')[0];
        productUsage.textContent = result.productDetail.useOf.split('|')[0];
        originalPrice.value = result.productDetail.MRP;
        offeredPrice.value = result.sellingDetail.price;
        quantity.value = result.sellingDetail.quantity;
    }else{
        message.textContent = result.message;
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add('message-hidden');
        },3000);
    }
}
submitBtn.addEventListener('click',async()=>{
    const prodId = window.location.href.split('/').pop();
    const response = await fetch(url+'seller/edit-product',{
        method: 'POST',
        headers : {'Content-Type':'application/json'},
        body:JSON.stringify({
            productId : prodId,
            qty : quantity.value,
            price : offeredPrice.value,
        }),
    });
    if(response.redirected){
        window.location.href = url+redirect;
        return;
    }
    const result =  await response.json();
    message.textContent = result.message;
    message.classList.remove('message-hidden');
    //for 2 sec display success message then for 3 sec display redirection message;
    setTimeout(()=>{
        let time = 3;
        const fxn = setInterval(()=>{
            message.textContent = `You will automatically be redirected in ${time}s`;
            time--;
            if(time==0){
                clearInterval(fxn);
            }
        },1000);
    },2000);

    setTimeout(()=>{
        message.classList.add('message-hidden');
    },6000);
    if(result.success){
        window.opener.postMessage({success:'updated'},`${url}seller/listed-products`);
        setTimeout(()=>{
            window.close();
        },6100);
    }
});
window.onload = loadProductDetail();