//  button related scripts foe grid
function attachEventListner(){
    const checkbox = document.querySelectorAll('.checkbox');
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
    // delete products
    deleteButton?.addEventListener('click',async(e)=>{
        const response = await fetch(url+'seller/delete-product',{
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productIdList : deleteButtonValue.value,
            }),
        });
        const contentType = response.headers.get('content-type');
        // if not possible to show message and file at the same tie do one thing, if result.success is false display message
        if(contentType && contentType.includes('application/json')){
            // message this done
            const result = await response.json();
            message.textContent = result.message;
            message.classList.remove('message-hidden');
            setTimeout(()=>{
                message.classList.add('message-hidden');
            });
            return;
        }else{
            // it might have returned the html content
            const res = await response.text();
            const displayField = document.querySelector('.body-wrapper');
            displayField.innerHTML = res;
            attachEventListner();
            // to update the localstorage we need to call another API which returns productData
            const listedProductLocalStorage = await fetch(url+'seller/listed-products-nameId',{
                method:'GET',
            });
            const result = await listedProductLocalStorage.json();
            localStorage.setItem(keyName,JSON.stringify(result.data));

        }
    });
}
attachEventListner();
//delete all product
// deleteButton.addEventListener('click',async(e)=>{
//     const response = await fetch(url+'seller/delete-product',{
//         method: 'POST',
//         headers:{ 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             productIdList : deleteButtonValue.value,
//         }),
//     });
//     const result = await response.json();
//     if(result.success){
//         // update local storage
//         const productName = result.data.map(item=>{
//             return {
//                 name:item.productId.name,
//                 productId: item.productId.productId,
//             }
//         });
//         //rerender entire page when product listed are 0
//         if(productName.length==0){
//             window.location.href = url+'seller/listed-products';
//             return;
//         }
//         localStorage.setItem(keyName,JSON.stringify(productName));

//         //render UI
//         const dataContainer = document.querySelector('.tableBody');
//         const checkbox = document.querySelectorAll('.checkbox');
//         dataContainer.innerHTML = '';
//         checkbox.forEach(item=>{
//             item.checked = false;
//         });
//         deleteButton.setAttribute('disabled',true);
//         result.data.forEach(prod=>{
//             const tr = `
//             <tr>
//                 <td class="checkBox"><input class="checkbox" type="checkbox" value="${prod.productId.productId}"></th>
//                 <td class="medicineName"> ${prod.productId.name} </td>
//                 <td class="medicineUse"> ${prod.productId.useOf.split('|')[0]} </td>
//                 <td class="medicineForm"> ${prod.productId.productForm} </td>
//                 <td class="medicineManufacturer"> ${prod.productId.manufacturer} </td>
//                 <td class="medicinePrice"> ${prod.price} </td>
//                 <td class="medicineQuantity"> ${prod.quantity} </td>
//             </tr>`;
//             dataContainer.insertAdjacentHTML('beforeend',tr);
//         });
//     }
//     deleteButtonValue.value='';
//     message.textContent = result.message;
//     message.classList.remove('message-hidden');
//     setTimeout(()=>{
//         message.classList.add('message-hidden');
//     },3000);
// });