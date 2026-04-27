let fruits = [
    {id: 1, title: 'Яблоки', price: 20, img: '1'},
    {id: 2, title: 'Oranges', price: 30, img: '2'},
    {id: 3, title: 'Mango', price: 40, img: '3'},
]

const toHTML = fruit =>`
    <div class="col">
        <div class="card">
            <img src="${fruit.img}" class="card-img-top" style="height: 300px;" alt="${fruit.title}">
            <div class="card-body">
                <h5 class="card-title">${fruit.title}</h5>
                <a href="#" class="btn btn-primary" data-btn="price" data-id = "${fruit.id}">Посмотреть цену</a>
                <a href="#" class="btn btn-danger" data-btn = "remove" data-id = "${fruit.id}">Удалить</a>
            </div>
        </div>
    </div>
`

function render(){
    const html = fruits.map(toHTML).join('');
    document.querySelector("#fruits").innerHTML = html;
}

render();

const priceModal = $.modal({
    title: "Цена на товар",
    closable: true,
    width: `400px`,
    footerButtons: [
        {text: 'Close', type: 'primary', handler(){
            priceModal.close();
        }},
    ]
});

document.addEventListener('click', e => {
    e.preventDefault();
    const btnType = e.target.dataset.btn;
    const id = +e.target.dataset.id;
    const fruit = fruits.find(f => f.id === id);

    if(btnType === 'price'){
        priceModal.setContent(`
            <p>Цена на ${fruit.title}: <strong>${fruit.price}$</strong></p>
            `)
        priceModal.open();
    }else if(btnType === 'remove') {
        $.confirm({
            title: "Вы уверены?",
            content: `<p>Удалить фрукт - ${fruit.title}?</p>`
        }).then(()=>{
            fruits = fruits.filter(f => f.id !== id);
            render();
        }).catch(()=>{

        })
        // confirmModal.setContent(`
        //     <p>Удалить фрукт - ${fruit.title}?</p>
        //     `);
        // confirmModal.open();
    }
})