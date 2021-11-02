// clase
class Combos {
    constructor(id, nombre, items, precio, cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.items = items;
        this.precio = precio;
        this.cantidad = 0
        this.num = cantidad
    }
    aumentarCantidad() {
        this.cantidad++
    }
    restarCantidad() {
        this.cantidad--
    }
    readLocal() {
        this.cantidad = this.num
    }

}


// lectura de localstorage

let carro = JSON.parse(localStorage.getItem('carrito'))

const pedido = []

if (carro) {
    for (const combo of carro) {
        pedido.push(new Combos(combo.id, combo.nombre, combo.items, combo.precio, combo.cantidad))
    }
}


let total = 0;

for (const combo of pedido) {
    combo.readLocal()
    total += (combo.precio * combo.cantidad)
    $('#carrito').append(`<div class="card relativeCard">
    <img src="../assets/resources/images/combo${combo.id}.jpg"class="card-img-top" alt=${combo.name}>
    <div class="card-body">
        <h5 class="card-title">${combo.nombre}</h5>
        <p class="card-text">Ingredientes: ${combo.items}</p>
        <p><strong>Precio: $${combo.precio}</strong></p>
    </div>
    <button id='restar${combo.id}'>restar</button>
    <p>Cantidad de unidades es <span id='contador${combo.id}'>${combo.cantidad}</span></p>
    <button id='sumar${combo.id}'>sumar</button>
    <button id='borrar${combo.id}' class='absoluteButton'>X</button>
    </div>
    `)
    $(`#restar${combo.id}`).click(() => {
        restar(combo, $(`#restar${combo.id}`), $(`#sumar${combo.id}`))
    });
    $(`#sumar${combo.id}`).click(() => {
        sumar(combo, $(`#sumar${combo.id}`), $(`#restar${combo.id}`))
    });
    $(`#borrar${combo.id}`).click(() => { 
        borrar(combo)
    });
}

function sumar(btn, btn2, btn3) {
    btn.aumentarCantidad()
    $(`#contador${btn.id}`).html(`${btn.cantidad}`);
    if (btn.cantidad >= 6) {
        btn2.attr('disabled', true)
        swal("No podes comprar más", "", "error", { button: "oh, okey D,:" })
    }
    btn3.attr('disabled', false)
    total += btn.precio
    $('#total').html('')
    $('#total').html(`$${total}`)
    localStorage.setItem('carrito', JSON.stringify(pedido))
}

function restar(btn, btn2, btn3) {
    btn.restarCantidad()
    $(`#contador${btn.id}`).html(`${btn.cantidad}`);
    if (btn.cantidad <= 0) {
        btn2.attr('disabled', true)
    }
    btn3.attr('disabled', false)
    total -= btn.precio
    $('#total').html('')
    $('#total').html(`$${total}`)

    localStorage.setItem('carrito', JSON.stringify(pedido))
}

function borrar (btn){
    const basura = pedido.findIndex(item => item.nombre == btn.nombre)
    pedido.splice(basura, 1)
    localStorage.setItem('carrito', JSON.stringify(pedido))
    location.reload()
}

$(`#vaciar`).click(function () {
    const div = $(`#carrito`)
    const vaciarCarrito = $(`#total`)
    div.html("")
    vaciarCarrito.html("")
    localStorage.clear();
});

$('#ticket').submit((e) => {
    e.preventDefault();
    let tarjeta = e.target.elements.formGroupExampleInput.value
    let fechaVencimiento = e.target.elements.formGroupExampleInput2.value
    let CVV = e.target.elements.formGroupExampleInput3.value
    let nombre = e.target.elements.formGroupExampleInput4.value

    if (tarjeta.length == 16 && CVV.length == 3 && fechaVencimiento && nombre) {
        $('#carrito').html('')
        $('#carrito').html('<h1>¡Muchas gracias por tu compra!</h1>')
        $(`#vaciar`).attr('disabled', true)
        $('#total').html('0')
        let pedidoFinal = JSON.parse(localStorage.getItem('carrito'))
        let finalticket = []
        if (pedidoFinal) {
            for (const combo of pedidoFinal) {
                finalticket.push(new Combos(combo.id, combo.nombre, combo.items, combo.precio, combo.cantidad))
            }
        }
        $('#ticketPlace').html(`
            <div class="resumenContainer">
            <p>Pedido para: ${nombre}<p>
            <p>Tu tarjeta es: ${tarjeta}<p>
            <p>Fecha de vencimiento: ${fechaVencimiento}<p>
            <p>resúmen de tu pedido:</p>
            <table id='mostrarPedido'>
            <thead>
                <th>Nombre</th>
                <th>Precio</th>
                <th>cantidad</th>
            </thead>
            <tbody id='mostrarPedido'></tbody>
            <tfoot><td><strong>Tu total es de: $${total}</strong></td></tfoot>
            </table>
            </div>
            `)

        for (const item of finalticket) {
            item.readLocal()
            $('#mostrarPedido').append(`
            <tr>
                <td>${item.nombre}</td>
                <td>$${item.precio * item.cantidad}</td>
                <td>${item.cantidad}</td>
            </tr>
            `)
        }
        e.target.elements.formGroupExampleInput.value = ''
        e.target.elements.formGroupExampleInput2.value = ''
        e.target.elements.formGroupExampleInput3.value = ''
        e.target.elements.formGroupExampleInput4.value = ''
        localStorage.clear();
    } else {
        let err1 = tarjeta.length == 16 ? '' : 'Tarjeta: la tarjeta tiene que tener 16 digitos'
        let err2 = fechaVencimiento.length == 3 ? '' : ', Fecha:  fecha de vencimiento incorrecta, '
        let err3 = CVV.length == 3 ? '' : ' CVV: son los 3 dígitos detrás de tu tarjeta, '
        let err4 = nombre ? '' : ' NOMBRE: por favor, escriba su nombre'
        swal(`Tenes los siguientes errores: ${err1}${err2}${err3}${err4} `, "", "error", { button: "ok" })
    }
});
$('#total').html(`$${total}`)