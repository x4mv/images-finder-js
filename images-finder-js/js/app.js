//importaciones 
import {api_key} from './cfg.js'

// url = 'https://pixabay.com/api/?key=42338025-3a10c80a43f3a2d6f83a4e8c9&q=yellow+flowers&image_type=photo'

// variables
const formulario = document.querySelector('#formulario');
const inputImagen = document.querySelector('#termino');
const resultadoView = document.querySelector('#resultado')



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

    formulario.reset();


}

function llamarAPI(nombreImagen){

    const url = `https://pixabay.com/api/?key=${api_key}&q=${nombreImagen}`;

    fetch(url)
        .then(resultado => resultado.json())
        .then(data => {
            limpiarHTML(resultadoView);
            console.log(data.hits)
            mostrarImagenes(data.hits)
        })
    
}

function mostrarImagenes(listaImagenes){

    listaImagenes.forEach(imagenObj => {
        const { id, type, largeImageURL } = imagenObj

        // creamos un div donde se alamacenaran todos los datos de las imagenes
        const divContenido = document.createElement('DIV');
        divContenido.textContent = `El id: ${id} es de tipo ${type} ver imagen -> : ${largeImageURL}`;

        resultadoView.appendChild(divContenido)

    });
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