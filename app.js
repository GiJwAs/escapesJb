
let carritoDeCompras = [];
let stockProductos = []

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonTerminar = document.getElementById('terminar')
const finCompra = document.getElementById('fin-compra')
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');
const selecTipo = document.getElementById('selecTipo')

selecTipo.addEventListener('change',()=>{
    console.log(selecTipo.value)
    if(selecTipo.value == 'all'){
        mostrarProductos(stockProductos)
    }else{
        mostrarProductos(stockProductos.filter(el => el.tipo == selecTipo.value))
        console.log(stockProductos.filter(el => el.tipo == selecTipo.value))
    }
})

    //ajax
    $.getJSON('data/stock.json', function(data){
        data.forEach(elemento => {
            stockProductos.push(elemento)
        })
        
        mostrarProductos(stockProductos)
        recuperar()
    })


function mostrarProductos(array){
   $('#contenedor-productos').empty();
    for (const producto of array) {
        let div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML += `<div class="box">
                            <img id="prueba" src=${producto.img}>
                            <h3><span class="card-title">${producto.nombre}</span></h3>
                            <div class="price"><p> $${producto.precio}</p></div>
                            <a id="boton${producto.id}" class="material-icons"><i class="material-icons md-48" style="cursor: pointer">add_shopping_cart</i></a>
                        </div> `
        contenedorProductos.appendChild(div);
        
        let boton = document.getElementById(`boton${producto.id}`)

        boton.addEventListener('click', ()=>{
            agregarAlCarrito(producto.id)
        })
    }
    
}
function agregarAlCarrito(id) {
    let repetido = carritoDeCompras.find(prodR => prodR.id == id);
    if(repetido){
        swal("Producto agregado con exito!", "", "success");
        console.log(repetido);
        repetido.cantidad = repetido.cantidad + 1;
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id="cantidad${repetido.id}">cantidad: ${repetido.cantidad}</p>`
        actualizarCarrito()
    }else{
        let productoAgregar = stockProductos.find(prod => prod.id == id);
        swal("Producto agregado con exito!", "", "success");
        carritoDeCompras.push(productoAgregar);
       
        actualizarCarrito()
        mostarCarrito(productoAgregar)
    }

     localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
}

function mostarCarrito(productoAgregar) {
    $('#mostrar-carrito').empty();
    let div = document.createElement('div')
        div.classList.add('productoEnCarrito')
        div.innerHTML = `<img id="prueba" src=${productoAgregar.img}>
                        <h3>${productoAgregar.nombre}</h3>
                        <div class="price">${productoAgregar.precio}</div>
                        <p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>
                        <button id="eliminar${productoAgregar.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`
        contenedorCarrito.appendChild(div)
  
        let botonEliminar = document.getElementById(`eliminar${productoAgregar.id}`)

        botonEliminar.addEventListener('click', ()=>{
            if(productoAgregar.cantidad > 1){
                productoAgregar.cantidad = productoAgregar.cantidad - 1
                document.getElementById(`cantidad${productoAgregar.id}`).innerHTML = `<p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>`
                localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
                actualizarCarrito()
            }else{
              botonEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(prodE => prodE.id != productoAgregar.id)
            localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
            actualizarCarrito()  
            }
            
        }) 
    }

function recuperar() {
    let recuperar = JSON.parse(localStorage.getItem('carrito'))
    if(recuperar){
        recuperar.forEach(el => {
            carritoDeCompras.push(el)
            mostarCarrito(el)
            actualizarCarrito()
        });
    }
}

function  actualizarCarrito (){
    console.log(carritoDeCompras.length);
    if(carritoDeCompras.length > 0){
        document.getElementById('finalizar').style.display= 'inline-block'
        document.getElementById('pagar').innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
    }else{
        document.getElementById('finalizar').style.display= 'none'
    }
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el)=> acc + el.cantidad, 0);
    precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
    
}

botonTerminar.innerHTML= '<a id="finalizar" class="waves-effect waves-light btn modal-trigger" href="#modal1">Finalizar Compra</a>'


$(()=>{
    $('.modal-trigger').leanModal();
  });

finCompra.addEventListener('click',()=>{

    if($('.number').val()== '' || $('.inputname').val() == ''||$('.expire').val()== ''||$('.ccv').val()== ''){
       
        $('input').css('border', 'solid 1px red')

    }else if(($('.number').val()!= '') && ($('.inputname').val()!= '') && ($('.expire').val() != '') && ($('.ccv').val()!= '')){

        $('input').css('border', 'none')
        localStorage.setItem('carrito', JSON.stringify([]))
        swal("Gracias por su compra!", "A la brevedad nos pondremos en contacto para coordinar el envio de los productos!", "success");
       $.post("https://jsonplaceholder.typicode.com/posts",JSON.stringify(carritoDeCompras),function(respuesta,estado) {
        console.log(respuesta)
        console.log(estado)
        if(estado){
            
            $('#modal1').closeModal();
            carritoDeCompras= []
            localStorage.clear()
            actualizarCarrito()
            setTimeout(() => {
                contenedorCarrito.innerHTML=''
                actualizarCarrito()
            }, 3000);
        }
      }) 
    }
})


  






