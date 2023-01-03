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

        tarjeta.innerHTML = `<div id="tarjetas">
        <p>${listasTodas[i].list_name}</p>
        <p>Oldest: ${listasTodas[i].oldest_published_date}</p>
        <p>Newest: ${listasTodas[i].newest_published_date}</p>
        <p>Updated: ${listasTodas[i].updated}</p>
        <input type="button" value="Read more!" id="btn${[i]}"></input>
        </div>`;
        let nombreLista = listasTodas[i].list_name;
        document.querySelector(`#btn${[i]}`).addEventListener("click", () => { init(nombreLista, tarjetas); })
    }
    async function getList(nombre) {
        let resultado = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${nombre}.json?api-key=RWybTfef3RewOzxt4nu6khx24FcPaoAI`);
        let dataBase = await resultado.json();
        const lista1 = dataBase.results;
        return lista1;
    }
    
    async function init(nombre, espacio) {
        let lista1 = await getList(nombre);
        console.log(lista1);
        console.log(nombre);
        espacio.innerHTML = "perrito OOOHH YESSS"
    }
}

showLists();