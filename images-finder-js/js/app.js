//importaciones 
import {api_key} from './cfg.js'

// url = 'https://pixabay.com/api/?key=42338025-3a10c80a43f3a2d6f83a4e8c9&q=yellow+flowers&image_type=photo'

// variables
const formulario = document.querySelector('#formulario');
const inputImagen = document.querySelector('#termino');
const resultadoView = document.querySelector('#resultado')
const paginacion = document.querySelector('#paginacion')
paginacion.classList.add('mt-4')


const imagenesPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;


document.addEventListener('DOMContentLoaded' , () =>{

    // buscar imagenes
    formulario.addEventListener('submit', buscarImagen);
});

//funciones 

function buscarImagen(e){
    e.preventDefault();

    const imagen = inputImagen.value;

    // validar que no se dejen campos vacios 
    if ( imagen === ''){
        mostrarAlerta('No se pueden dejar campos vacios', 'error');
        return;
    }

    mostrarAlerta('Buscando');

    setTimeout(() => {
        llamarAPI();
        
    }, 2000);

    


}

function llamarAPI(){

    const  nombreImagen = inputImagen.value;
    const url = `https://pixabay.com/api/?key=${api_key}&q=${nombreImagen}&image_type=photo&per_page=${imagenesPorPagina}&page=${paginaActual}`
    //const url = `https://pixabay.com/api/?key=${api_key}&q=${nombreImagen}&image_type=photo`;
    fetch(url)
        .then(resultado => resultado.json())
        .then(data => {
            totalPaginas = calcularPaginacion(data.totalHits)

            limpiarHTML(resultadoView);
            mostrarImagenes(data.hits)
        })
    
}

function mostrarImagenes(listaImagenes){

    listaImagenes.forEach(imagenObj => {
        const { id, comments, likes, previewURL, largeImageURL } = imagenObj

        // damos estilos grid al resultadoView 
        resultadoView.className = 'gap-1 mt-24 ml-20 mr-20 sm:grid-cols-1 md:grid-cols-4 xl:grid grid-cols-5'
        // creamos un div donde se alamacenaran todos los datos de las imagenes
        const contenedor = document.createElement('DIV');
        contenedor.className = 'bg-white rounded-md overflow-hidden shadow-md p-4 m-4';

        // const divCard = document.createElement('DIV');
        // divCard.classList.add('card', 'mb4')

        const fotoImagen = document.createElement('IMG');
        fotoImagen.classList = 'mx-auto mb-4'
        fotoImagen.src = previewURL;
        fotoImagen.alt = `imagen numero ${id}`;

        const likesImagen = document.createElement('p');
        likesImagen.classList = 'mx-auto mb-4 font-bold';
        likesImagen.textContent = `${likes} likes`;

        const commentsImagen = document.createElement('p');
        commentsImagen.classList = 'mx-auto mb-4 font-bold';
        commentsImagen.textContent = `${comments} comments`;

        const verImagen = document.createElement('button');
        verImagen.classList = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded p-2 mx-auto w-full'
        verImagen.textContent = 'Ver Imagen';
        verImagen.onclick = () => verImagenGrande(largeImageURL)

        // agg la miniatura al contenido 

        contenedor.appendChild(fotoImagen);
        contenedor.appendChild(likesImagen);
        contenedor.appendChild(commentsImagen);
        contenedor.appendChild(verImagen);

        
        resultadoView.appendChild(contenedor)

        


    });

    
    limpiarHTML(paginacion)
    imprimirPaginador();

}

// imprimir paginador 

function imprimirPaginador(){

    iterador = crearPaginador(totalPaginas)



    while(true){
        const {value, done} = iterador.next()
        if(done) return;
        // creando un boton por cada pagina 
        const paginaBtn = document.createElement('a');
        paginaBtn.href ='#'
        paginaBtn.dataset.pagina = value;
        paginaBtn.textContent = value;
        paginaBtn.classList.add('siguiente', 'bg-yellow-400', 'px-4' , 'py-1', 'font-bold', 'rounded', 'uppercase', 'mb-10', 'mr-2', 'mt-4')
    
        paginaBtn.onclick = () => {
            paginaActual = value;
            llamarAPI()
        }
        paginacion.appendChild(paginaBtn);
    }
    
}

// generador para ubicar la paginacion 
function *crearPaginador(total){
    for (let i = 1; i<= total; i++){
        yield i;
    }
}

function calcularPaginacion (total){
    return parseInt(Math.ceil(total/imagenesPorPagina));
}

function verImagenGrande(url){
    window.open(url, '_blank');
}

function mostrarAlerta(mensaje, tipo){

    const existeAlerta = document.querySelector('.bg-red-600') || document.querySelector('.bg-green-600')
    
    if (!existeAlerta){

        const divAlerta = document.createElement('DIV');
        divAlerta.classList.add('p-2', 'm-4', 'text-white', 'text-center');

        if (tipo === 'error'){
            divAlerta.classList.add('bg-red-600');
        }else{
            divAlerta.classList.add('bg-green-600');
        }

        divAlerta.textContent = mensaje; 

        formulario.appendChild(divAlerta);

        setTimeout(() => {
            divAlerta.remove()
        }, 3000);

    }
    
}

function limpiarHTML(ref){

    while(ref.firstChild){
        ref.removeChild(ref.firstChild)
    }
}