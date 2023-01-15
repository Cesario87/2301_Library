const firebaseConfig = {
    apiKey: "AIzaSyC1pc5HHTbWSSUhodQe1l4LD2tERRQurK0",
    authDomain: "library-4a7cc.firebaseapp.com",
    projectId: "library-4a7cc",
    storageBucket: "library-4a7cc.appspot.com",
    messagingSenderId: "217622494963",
    appId: "1:217622494963:web:7c1a2b8c4421d241f10186"
  };

  firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

  const db = firebase.firestore();// db representa mi BBDD //inicia Firestore
  
  // Initialize Firebase Authentication and get a reference to the service
  const auth = firebase.auth();

async function getLists() {
    let resultado = await fetch("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=RWybTfef3RewOzxt4nu6khx24FcPaoAI");
    let dataBase = await resultado.json();
    const listas = dataBase.results;
    return listas;
}

async function showLists() {
    let listasTodas = await getLists();

    let tarjetas = document.querySelector(".overall");
    tarjetas.setAttribute("id", "");
    
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
            <input type="button" value="Add to favorites" id=btnFav${[j]}></input>
            <a href="${lista1.books[j].amazon_product_url}"><img id="iconoAmazon" src="./images/amazon.jpg"></img></a>
            </div>`;

            document.querySelector(`#btnFav${[j]}`).addEventListener('click', function(){

                auth.onAuthStateChanged(user => {
                    if(user){
                        db.collection("favoritos").add(
                            {
                            email: user.email,
                            title: lista1.books[j].title,
                            cover: lista1.books[j].book_image,
                            amazon: lista1.books[j].amazon_product_url
                          })
                    }
                })
            })
    };
    
    let arrData = [];
    auth.onAuthStateChanged(user => {
        if(user){
          return db.collection("favoritos").where("email", "==", user.email).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const favs = document.querySelector(".popUp-content2");
                const fichasFavs = document.createElement("div");
                favs.appendChild(fichasFavs);
                fichasFavs.setAttribute("id", "tarjetasLibrosFav")
                fichasFavs.innerHTML = `<p>${doc.data().title}</p>
                <img id="formatImgFav" src="${doc.data().cover}"></img>
                <div id="botonesFavAmazon">
                <a href="${doc.data().amazon}"><img id="iconoAmazon" src="./images/amazon.jpg"></img></a>
                </div>`;

                // console.log(doc.data());
          });
          });  
        }
    });   

    crearBoton("btnIndex1")
}
}
showLists();

const loaderContainer = document.querySelector('.loader-container');
window.addEventListener('load', () => {
    loaderContainer.style.display = 'none';
});

//FIRESTORE-->
//SIGN IN
const signInForm = document.querySelector('#sign-form');

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.querySelector("#sign-email").value;
  const password = document.querySelector("#sign-pass").value;

  auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
          signInForm.reset();

          console.log('sign in');
      }).catch((error) => {
        //let errorCode = error.code;
        let errorMessage = error.message;
        alert(errorMessage);
      });
});
//LOGIN
const logInForm = document.querySelector("#login-form");

  logInForm.addEventListener("submit", (e)=> {
    e.preventDefault();

    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-pass").value;

    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            signInForm.reset();

            console.log('log in');
        }).catch((error) => {
          //let errorCode = error.code;
         
          let errorMessage = error.message;
          alert(errorMessage)
        });
})

//Log Out
const logOut = document.querySelector("#log_out");

logOut.addEventListener("click", e => {
    e.preventDefault();
    encabezado2.appendChild(vacio);
    auth
        .signOut()
        .then(() => {
            console.log('log out');
        })
})

    const botonFav = document.createElement("a");
    botonFav.setAttribute("class", "button");
    botonFav.setAttribute("id", "openFavs");
    botonFav.innerHTML = "Check favorite books";
    const encabezado2 = document.getElementById("header");
    const vacio = document.createElement("div");
//RECOGIDA
auth.onAuthStateChanged(user => {
if(user){
    
    encabezado2.appendChild(botonFav);

    document.querySelector("#openFavs").addEventListener("click", function(){
        document.querySelector(".popUp2").style.display = "flex";
    });
}
})
