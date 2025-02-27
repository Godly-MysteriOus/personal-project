
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
        productManufacturer.textContent = result.productDetail.manufacturer;
        productPackagingInfo.textContent = result.productDetail.packagingDetails;
        productType.textContent = result.productDetail.productForm;
        productUsage.textContent = result.productDetail.useOf;
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
window.onload = loadProductDetail();