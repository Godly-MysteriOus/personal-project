

function attachEventListner(){
    //to reload data
    const displayField = document.querySelector('.body-wrapper');
    //  button related scripts for grid
    const checkbox = document.querySelectorAll('.checkbox');
    const detailButton = document.querySelector('.detailButton');
    const editButton = document.querySelector('.editButton');
    const deleteButton = document.querySelector('.deleteButton');
    const detailButtonValue = document.querySelector('.detailButtonValue');
    const editButtonValue = document.querySelector('.editButtonValue');
    const deleteButtonValue = document.querySelector('.deleteButtonValue');
    const gridFunctionality = document.querySelector('.gridDataHolder');
    //pagination buttons
    
    const singleLeftBtn = document.querySelector('.single-left');
    const doubleLeftBtn = document.querySelector('.double-left');
    const singleRightBtn = document.querySelector('.single-right');
    const doubleRightBtn = document.querySelector('.double-right');
    const currentPage = document.querySelector('.currentPage');
    const lastPage = document.querySelector('.lastPage');
    gridFunctionality?.addEventListener('click',async(e)=>{
        let checkedCount=0;
        let values = '';
        const element = e.target.closest('tr').querySelector('td').querySelector('input');
        if(!element.getAttribute('checked')){
            e.target.closest('tr').querySelector('td').querySelector('input').setAttribute('checked',true);
        }else{
            e.target.closest('tr').querySelector('td').querySelector('input').removeAttribute('checked');
        }
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
            detailButtonValue.value = element.value;
            editButtonValue.value = element.value;
            deleteButtonValue.value = element.value;
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
                currentPage : currentPage.value,
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
            },3000);
            return;
        }else{
            // it might have returned the html content
            const res = await response.text();
            message.textContent = 'Deleted Product Successfully';
            message.classList.remove('message-hidden');
            setTimeout(()=>{
                message.classList.add('message-hidden');
            },3000);
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

    async function PaginatedDataLoading(pageNo){
        const response = await fetch(url+'seller/paginated-data',{
            method:'POST',
            headers:{'Content-Type': 'application/json' },
            body:JSON.stringify({
                pageNo : pageNo,
            }),
        });
        const contentType = response.headers.get('content-type');
        if(contentType && contentType.includes('application/json')){
            const result = await response.json();
            message.textContent = result.message;
            message.classList.remove('message-hidden');
            setTimeout(()=>{
                message.classList.add('message-hidden');
            },3000);
        }else{
            const result = await response.text();
            displayField.innerHTML = result;
            attachEventListner();
        }
    }
    singleLeftBtn.addEventListener('click',()=>{
        if(Number(currentPage.value)>1){
            PaginatedDataLoading(Number(currentPage.value)-1);
        }
    });
    singleRightBtn.addEventListener('click',()=>{
        if(Number(lastPage.value)>Number(currentPage.value)){
            PaginatedDataLoading(Number(currentPage.value)+1);
        }
    });
    doubleLeftBtn.addEventListener('click',()=>{
        PaginatedDataLoading(1);
    });
    doubleRightBtn.addEventListener('click',()=>{
        PaginatedDataLoading(Number(lastPage.value));
    });
    currentPage.addEventListener('keydown',(e)=>{
        if(e.key=='Enter'){
            PaginatedDataLoading(Number(currentPage.value));
        }
    });
    let editTab = null;
    editButton.addEventListener('click',(e)=>{
        console.log(editTab);
        if(!editTab){
            editTab = window.open(url+`seller/edit-product/${editButtonValue.value}`,'_blank');
        }else{
            editTab.focus();
        }
    });
    window.addEventListener("message",(event)=>{
        console.log(event.data.success);
        if(event.data.success=='updated'){
            editTab = null;
            PaginatedDataLoading(currentPage.value);
        }
    });
}
attachEventListner();