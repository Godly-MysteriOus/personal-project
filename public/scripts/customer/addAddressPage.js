
const locationAccessButton = document.querySelector('.locationAccessButton');
const pincode = document.querySelector('.userPincode');
const city = document.querySelector('.userCity'); 
const state = document.querySelector('.userState');
const saveButton = document.querySelector('.saveButton');
const userLatitude = document.querySelector('.userLatitude');
const userLongitude = document.querySelector('.userLongitude');
const userPhoneNumber = document.querySelector('.userPhoneNumber');
const userAddress = document.querySelector('.userAddress');
const addAddressContainer = document.querySelector('.addAddressContainer');
async function getAddressFromCoordinates(lat,lng){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapAPI_key}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
            const addressComponents = data.results[0].address_components;

            let city, state, pincode;

            addressComponents.forEach((component) => {
                if (component.types.includes("locality")) {
                    city = component.long_name;
                }
                if (component.types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                }
                if (component.types.includes("postal_code")) {
                    pincode = component.long_name;
                }
            });
            return [city,state,pincode];
        } else {
            console.error("Geocoding failed:", data.status);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
locationAccessButton.addEventListener('click',async(e)=>{
    var lat,lng,result;
    navigator.geolocation.getCurrentPosition(
        async(position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            userLatitude.value = lat;
            userLongitude.value = lng;
            result = await getAddressFromCoordinates(lat, lng);
            pincode.value = result[2];
            city.value = result[0];
            state.value = result[1];

        },
        (error) => console.error("Error getting location:", error)
    );
});
function hideMessageBox(){
    setTimeout(()=>{
        message.classList.add('message-hidden');
    },3500);
}
saveButton.addEventListener('click',async(e)=>{
    let result;
    if(pincode.value== false && city.value==false && state.value==false){
        // get location and other details
        result = await new Promise((resolve,reject)=>{
            navigator.geolocation.getCurrentPosition(async(position)=>{
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                userLatitude.value = lat;
                userLongitude.value = lng;
                result = await getAddressFromCoordinates(lat,lng);
                pincode.value = result[2];
                city.value = result[0];
                state.value = result[1];

                if(result){
                    resolve(result);
                }else{
                    reject(false);
                }
            });
        })
    }
    //perform basic checks
    message.classList.remove('message-hidden');
    if(Number(userPhoneNumber.value)==isNaN){
        message.textContent = 'Phone number shall only contain numbers';
        hideMessageBox();
        return;
    }else if(! (/^[1-9][0-9]{9}/.test(Number(userPhoneNumber.value)))){
        message.textContent = 'Invalid Phone number';
        hideMessageBox();
        return;
    }
    if(userAddress.value.length==0){
        message.textContent = 'Address cannot be empty';
        hideMessageBox();
        return;
    }
    else if((/[^a-zA-Z0-9 -/,]/.test(userAddress.value))){
        message.textContent = 'Address can only contain alphanumeric or - / characters';
        hideMessageBox();
        return;
    }
    //make an API call 
    const request = await fetch(url+'customer/save-address',{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            mobileNo : userPhoneNumber.value,
            latitude:userLatitude.value,
            longitude:userLongitude.value,
            pincode:pincode.value||result[2],
            state:state.value||result[1],
            city:city.value||result[0],
            address:userAddress.value,
        }),
    });
    const response = await request.json();
    if(response.success){
        document.querySelector('.addressTextHolder').textContent = pincode.value+", "+city.value+" ,"+state.value;
        userPhoneNumber.value='';
        pincode.value='';
        state.value='';
        city.value='';
        userLatitude.value='';
        userLongitude.value='';
        addAddressContainer.style.animation = 'hidePopup 1s ease-in-out';
        setTimeout(()=>{
            addAddressContainer.classList.add('hideAddAddressPopup');
        },900);
    }
    message.textContent = response.message;
    hideMessageBox();
})

userPhoneNumber.addEventListener('blur',async(e)=>{
    message.classList.remove('message-hidden');
    if(Number(userPhoneNumber)){
        message.textContent = 'Phone number shall only contain numbers';
    }else if(! (/^[1-9][0-9]{9}/.test(Number(userPhoneNumber)))){
        message.textContent = 'Invalid Phone number';
    }
    return hideMessageBox();
});