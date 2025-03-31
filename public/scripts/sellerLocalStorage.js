
//dealing with localStorage
const obj = {
    sellerName : '',
    sellerEmail : '',
    sellerMobileNo : '',
    drugLicenseNumber : '',
    gstRegistrationNumber : '',
    fssaiLicenseNumber : '',
    storeName: '',
    line1Address : '',
    pincode : '',
    shopState: '',
    shopCity : '',
    locationLatitude : '',
    locationLongitude :  '', 
};
const doesObjExists = JSON.parse(localStorage.getItem("sellerData"));
if(doesObjExists ==null){
    localStorage.setItem("sellerData", JSON.stringify(obj));
}


// fetch function 
function fetchData(fieldName){
    const sellerObj = JSON.parse(localStorage.getItem('sellerData'));

    return sellerObj[fieldName];
}
function updateData(fieldName,value){
    const sellerObj = JSON.parse(localStorage.getItem('sellerData'));
    sellerObj[fieldName] = value;
    localStorage.setItem("sellerData",JSON.stringify(sellerObj));
};

function deleteData(){
    localStorage.removeItem('sellerData');
}