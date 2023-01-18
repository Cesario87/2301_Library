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
            <input type="button" value="Add to favorites" id=btnFav${[j]} class="formatFav"></input>
            <a href="${lista1.books[j].amazon_product_url}"><img id="iconoAmazon" src="./images/amazon.jpg"></img></a>
            </div>`;

            document.querySelector(`#btnFav${[j]}`).addEventListener('click', function () {

                auth.onAuthStateChanged(user => {
                    if (user) {
                        db.collection("favoritos").add(
                            {
                                email: user.email,
                                title: lista1.books[j].title,
                                cover: lista1.books[j].book_image,
                                amazon: lista1.books[j].amazon_product_url
                            })

                    }else{
                        alert("Sign/log in, please.");
                    }
                })
                init(nombre, tarjetas);

            })

        };

        crearBoton("btnIndex1")
    }
}
showLists();

function cargaFavs(){
auth.onAuthStateChanged(user => {
    if (user) {
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
            });
        });
    }
});
};

const loaderContainer = document.querySelector('.loader-container');
window.addEventListener('load', () => {
    loaderContainer.style.display = 'none';
});

//FIRESTORE-->
//SIGN IN
function getFile(e) {
    var fileItem;
    var fileName;
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    var fileText = document.querySelector(".fileText");
    fileText.innerHTML = fileName;
  }

  function uploadImage(fileItem, fileName) {
    let storageRef = firebase.storage().ref("images/" + fileName);
    let uploadTask = storageRef.put(fileItem);
    uploadTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
    }, (error) => {
    // Handle unsuccessful uploads
    console.log(error);
    }, () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
    });
    });
  }

  const signInForm = document.querySelector('#sign-form');

  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#sign-email").value;
    const password = document.querySelector("#sign-pass").value;

    const fileInput = document.querySelector("#imgUser");
    fileInput.addEventListener("change", (e) => {
        getFile(e);
        uploadImage(fileItem, fileName);
    });

    auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            signInForm.reset();
            alert("You have signed in and image uploaded");
            console.log('signed in');
        }).catch((error) => {
            //let errorCode = error.code;
            let errorMessage = error.message;
            alert(errorMessage);
        });
});
//LOGIN
const logInForm = document.querySelector("#login-form");

logInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-pass").value;

    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            signInForm.reset();
            alert("You have logged in");
            console.log('logged in');
            setTimeout(() => {
                document.location.reload();
            }, 300);
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
    document.location.reload();
})

const botonFav = document.createElement("a");
botonFav.setAttribute("class", "button");
botonFav.setAttribute("id", "openFavs");
botonFav.innerHTML = "Check favorite books";
const encabezado2 = document.getElementById("header");
const vacio = document.createElement("div");
//RECOGIDA
auth.onAuthStateChanged(user => {
    if (user) {

        encabezado2.appendChild(botonFav);

        document.querySelector("#openFavs").addEventListener("click", function () {
            
            cargaFavs();
            document.querySelector(".popUp2").style.display = "flex";
            document.querySelector("body").style.overflow = "hidden";
        });
    }
})
