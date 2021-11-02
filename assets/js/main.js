// 1) creacion de variables y classes / constructores
// 2) creacion de funciones
// 3) asignacion de valor 
// 4) ejecucion del codigo


// Clase constructora
class Combos {
    constructor(id, nombre, items, precio, cantidad){
        this.id = id;
        this.nombre = nombre;
        this.items = items;
        this.precio = precio;
        this.cantidad = cantidad ? cantidad : 0
        this.num = cantidad 
    }
    aumentarCantidad(){
        this.cantidad++
    }
    readLocal(){
        this.cantidad = this.num
    }
}
const pedido = [];
const carrito = [];

// ------------------------------------------------

// Usando AJAX
$.ajax({
    type: "get",
    url: '../../database/db.json',
    success: (response) => {
        let data = response[0]
        console.log(data)
        for (const combo of data){
            pedido.push(new Combos(combo.id, combo.nombre, combo.desc, combo.precio))
        }

// ----------------------------------------------------------------
// Iterando el array de objetos para crear las cards
for (const combo of pedido) {
    $('#combos').append(`<div class="card">
    <img src="../assets/resources/images/combo${combo.id}.jpg"class="card-img-top" alt=${combo.nombre}>
    <div class="card-body">
        <h5 class="card-title">${combo.nombre}</h5>
        <p class="card-text">Ingredientes ${combo.items}</p>
        <p><strong>Precio: $${combo.precio}</strong></p>
        <button id=${combo.id} class="btn btn-primary comprar">Agregar al carrito</button>
    </div>`)
    
    let botoncito = $(`#${combo.id}`)
    botoncito.on('click', () => comprarCombos(combo, botoncito))
}
// ------------------------------------------------------------------
// Creando el carrito
function comprarCombos(combo, boton){
    let compra = carrito.find(item => item.nombre === combo.nombre)
    if(compra){
        if(compra.cantidad < 2){
            combo.aumentarCantidad();
        }else{
            boton.attr('disabled', true)
            swal("Agregalas en tu carrito", "", "error", {button: "OK !"})
        }
    }else{
        carrito.push(combo);
        combo.aumentarCantidad();
    }
    let total = 0;
    for(let i=0; i<carrito.length;i++){
        total += carrito[i].cantidad;
    }
    const contador = $('#cantidadCarrito');
    contador.html(`${total}`)
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
let carro = JSON.parse(localStorage.getItem('carrito'))

    if(carro){
        for(let i = 0; i < carro.length; i++){
            carrito.push(new Combos(carro[i].id, carro[i].nombre, carro[i].items, carro[i].precio, carro[i].cantidad))
            carrito[i].readLocal()
        }
        let total = 0;
        for(let i=0; i<carrito.length;i++){
            total += carrito[i].cantidad;
        }
        console.log(total)
        const contador = $('#cantidadCarrito');
        contador.html(`${total}`)
    } else {
        console.log('no hay nada')
    }
}
});