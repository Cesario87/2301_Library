
async function getLists() {
    let resultado = await fetch("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=RWybTfef3RewOzxt4nu6khx24FcPaoAI");
    let dataBase = await resultado.json();
    const listas = dataBase.results;
    return listas;
}

let header = document.querySelector("#header");
let encabezado = document.createElement("div")
header.appendChild(encabezado);

async function showLists() {
    let listasTodas = await getLists();

    let tarjetas = document.querySelector(".overall");
    tarjetas.setAttribute("id", "");
    encabezado.innerHTML = `<img src="Captura.PNG" id="encabezado"></img>`;

    for (let i = 0; i < listasTodas.length; i++) {
        let tarjeta = document.createElement("div")
        tarjetas.appendChild(tarjeta);
        tarjeta.setAttribute("id", "tarjetasListas");

        tarjeta.innerHTML = `
        <p id="titulosListas">${listasTodas[i].list_name}</p>
        <p>Oldest: ${listasTodas[i].oldest_published_date}</p>
        <p>Newest: ${listasTodas[i].newest_published_date}</p>
        <p>Updated: ${listasTodas[i].updated}</p>
        <input type="button" value="READ MORE! >" class="botonesListas" id="btn${[i]}"></input>
        `;
        let nombreLista = listasTodas[i].list_name;
        document.querySelector(`#btn${[i]}`).addEventListener("click", () => { init(nombreLista, tarjetas); })
    }
    async function getOneList(nombre) {
        let resultado = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${nombre}.json?api-key=RWybTfef3RewOzxt4nu6khx24FcPaoAI`);
        let dataBase = await resultado.json();
        const lista1 = dataBase.results;
        return lista1;
    }

    async function init(nombre, espacio) {
        let lista1 = await getOneList(nombre);
        espacio.innerHTML = "";

        let tituloLista = document.createElement("div")
        espacio.appendChild(tituloLista);
        tituloLista.innerHTML = `${lista1.display_name}`;
        tituloLista.setAttribute("id", "tituloLista");

        function crearBoton(idBtn) {
            let botonIndex = document.createElement("div");
            espacio.appendChild(botonIndex);
            espacio.setAttribute("id", "seccionListas");
            botonIndex.innerHTML = `<input type="button" value="< BACK TO INDEX" id="${idBtn}"></input>`;
            const botonIndex1 = document.getElementById(idBtn);
            botonIndex1.onclick = () => {
                espacio.innerHTML = "";
                showLists()
            };
        }

        crearBoton("btnIndex")

        let espacioTarjetas = document.createElement("div")
        espacio.appendChild(espacioTarjetas);
        espacioTarjetas.setAttribute("id", "flexTarjetas");

        for (let j = 0; j < lista1.books.length; j++) {
            let espacioLibros = document.createElement("div");
            espacioTarjetas.appendChild(espacioLibros);
            espacioLibros.setAttribute("id", "tarjetasLibros");
            espacioLibros.innerHTML = `
            <p id="rankedTitle">#${lista1.books[j].rank} ${lista1.books[j].title}</p>
            <div class="centrarPortadas">
            <img id="portada" src="${lista1.books[j].book_image}"></img>
            </div>
            <p>Weeks on list: ${lista1.books[j].weeks_on_list}</p>
            <p>${lista1.books[j].description}</p>
            <div id="botonesFavAmazon">
            <input type="button" value="Add to favorites" id="btnFav"></input>
            <a href="${lista1.books[j].amazon_product_url}"><img id="iconoAmazon" src="amazon.jpg"></img></a>
            </div>`;
        }

        const botonFav = document.querySelector("#btnFav");
        botonFav.onclick = () => {
            //GUARDAR FAVORITO EN FIREBASE
        };

        crearBoton("btnIndex1")
    };
}

showLists();

const loaderContainer = document.querySelector('.loader-container');
window.addEventListener('load', () => {
    loaderContainer.style.display = 'none';
});