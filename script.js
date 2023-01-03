async function getLists() {
    let resultado = await fetch("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=RWybTfef3RewOzxt4nu6khx24FcPaoAI");
    let dataBase = await resultado.json();
    const listas = dataBase.results;
    return listas;
}

// async function getHardcoverFiction() {
//     let list_name = "hardcover-fiction";
//     let resultado = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${list_name}.json?api-key=RWybTfef3RewOzxt4nu6khx24FcPaoAI`);
//     let dataBase = await resultado.json();
//     const lista1 = dataBase.results;
//     return lista1;
// }

// async function init() {
//     let lista1 = await getHardcoverFiction();
//     console.log(lista1);
// }

// init();

async function showLists() {
    let listasTodas = await getLists();
    let tarjetas = document.querySelector("#seccionListas");

    for (let i = 0; i < listasTodas.length; i++) {
        let tarjeta = document.createElement("div")
        tarjetas.appendChild(tarjeta);

        tarjeta.innerHTML = `<div id="tarjetasListas">
        <p>${listasTodas[i].list_name}</p>
        <p>Oldest: ${listasTodas[i].oldest_published_date}</p>
        <p>Newest: ${listasTodas[i].newest_published_date}</p>
        <p>Updated: ${listasTodas[i].updated}</p>
        <input type="button" value="Read more!" id="btn${[i]}"></input>
        </div>`;
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
        console.log(lista1);
        console.log(nombre);
        espacio.innerHTML = "";
        let botonIndex = document.createElement("div");
        espacio.appendChild(botonIndex);
        botonIndex.innerHTML = `<input type="button" value="BACK TO INDEX" id="btnIndex"></input>`;
        
        const botonIndex1 = document.querySelector("#btnIndex");
        botonIndex1.onclick = () => {
            espacio.innerHTML = "";
            showLists()
        };

        for (let j = 0; j < lista1.books.length; j++) {
            let espacioLibros = document.createElement("div");
            espacio.appendChild(espacioLibros);
            espacioLibros.innerHTML = `<div id="tarjetasLibros">
            <p>#${lista1.books[j].rank} ${lista1.books[j].title}</p>
            <img id="portada" src="${lista1.books[j].book_image}"></img>
            <p>Weeks on list: ${lista1.books[j].weeks_on_list}</p>
            <p>${lista1.books[j].description}</p>
            <input type="button" value="FAV" id="btnFav"></input>
            <a href="${lista1.books[j].amazon_product_url}"><img id="iconoAmazon" src="amazon.jpg"></img></a>
            </div>`;
        }

        const botonFav = document.querySelector("#btnFav");
        botonFav.onclick = () => {
            //GUARDAR FAVORITO EN FIREBASE
        };
    }
}

showLists();

const loaderContainer = document.querySelector('.loader-container');
window.addEventListener('load', () => {
    loaderContainer.style.display = 'none';
});