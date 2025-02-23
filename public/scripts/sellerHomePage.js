//  button related scripts foe grid


const detailButton = document.querySelector('.detailButton');
const editButton = document.querySelector('.editButton');
const deleteButton = document.querySelector('.deleteButton');
const detailButtonValue = document.querySelector('.detailButtonValue');
const editButtonValue = document.querySelector('.editButtonValue');
const deleteButtonValue = document.querySelector('.deleteButtonValue');
const gridFunctionality = document.querySelector('.gridDataHolder');
gridFunctionality?.addEventListener('click',async(e)=>{
    let checkedCount=0;
    let values = '';
    const checkbox = document.querySelectorAll('.checkbox');
    checkbox.forEach(item=>{
        if(item.checked){
            values+=item.value;
            values+=',';
            checkedCount++;
        }
    });
    if(checkedCount<=0){
        detailButton.setAttribute('disabled',true);
        editButton.setAttribute('disabled',true);
        deleteButton.setAttribute('disabled',true);
        detailButtonValue.value = '';
        editButtonValue.value = '';
        deleteButtonValue.value = '';
    }
    else if(checkedCount==1){
        detailButton.removeAttribute('disabled');
        editButton.removeAttribute('disabled');
        deleteButton.removeAttribute('disabled');
        detailButtonValue.value = e.target.value;
        editButtonValue.value = e.target.value;
        deleteButtonValue.value = e.target.value;
    }else{
        detailButton.setAttribute('disabled',true);
        editButton.setAttribute('disabled',true);
        deleteButton.removeAttribute('disabled');
        detailButtonValue.value = '';
        editButtonValue.value = '';
        deleteButtonValue.value = values.substring(0,values.length-1);
    }
});

// searchbar suggesstion and get all product button
/*
    const searchInputField = document.querySelector('.searchInput');
    const suggesstions = document.querySelector('.suggestionBox');
    const medicineIdValue = document.querySelector('.medicineId');

    -------------- already declared in searchBox -------------------------
*/
const getAllProductBtn = document.querySelector('.getAllProductBtn');
const suggestionBox = document.querySelector('.suggestionBox');
//  generate Suggesstion
searchInputField.addEventListener('input',async(e)=>{
    const inputData = String(searchInputField.value);
    const listedProductList = JSON.parse(localStorage.getItem(keyName));
    let suggesstionList  = [];
    suggesstionList =  listedProductList.filter(item=>String(item.name).toLowerCase().includes(inputData.toLowerCase()));
    if(suggesstionList.length==0){
        suggesstionList.push({name:'No Item Present',productId:''});
    }
    const maxIteration = suggesstionList.length > 10 ? 10 : suggesstionList.length;
    suggestionBox.classList.remove('suggestionBox-hidden');
    suggestionBox.innerHTML = '';
    for(let i=0; i<maxIteration; i++){
        const option = document.createElement('option');
        option.textContent = suggesstionList[i].name;
        option.value = suggesstionList[i].productId;
        option.classList.add('optionField');
        suggestionBox.appendChild(option);
    }
});
// shows all product
getAllProductBtn.addEventListener('click',async(e)=>{
    window.location.href = url+'seller/listed-products';
});


//delete all product
deleteButton.addEventListener('click',async(e)=>{
    const response = await fetch(url+'seller/delete-product',{
        method: 'POST',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productIdList : deleteButtonValue.value,
        }),
    });
    const result = await response.json();
    if(result.success){
        // update local storage
        const productName = result.data.map(item=>{
            return {
                name:item.productId.name,
                productId: item.productId.productId,
            }
        });
        if(productName.length==0){
            window.location.href = url+'seller/listed-products';
            return;
        }
        localStorage.setItem(keyName,JSON.stringify(productName));

        //render UI
        const dataContainer = document.querySelector('.tableBody');
        const checkbox = document.querySelectorAll('.checkbox');
        dataContainer.innerHTML = '';
        checkbox.forEach(item=>{
            item.checked = false;
        });
        result.data.forEach(prod=>{
            const tr = `
            <tr>
                <td class="checkBox"><input class="checkbox" type="checkbox" value="${prod.productId.productId}"></th>
                <td class="medicineName"> ${prod.productId.name} </td>
                <td class="medicineUse"> ${prod.productId.useOf.split('|')[0]} </td>
                <td class="medicineForm"> ${prod.productId.productForm} </td>
                <td class="medicineManufacturer"> ${prod.productId.manufacturer} </td>
                <td class="medicinePrice"> ${prod.price} </td>
                <td class="medicineQuantity"> ${prod.quantity} </td>
            </tr>`;
            dataContainer.insertAdjacentHTML('beforeend',tr);
        });
    }
    deleteButtonValue.value='';
    message.textContent = result.message;
    message.classList.remove('message-hidden');
    setTimeout(()=>{
        message.classList.add('message-hidden');
    },3000);
});