//////////////////////////////////////////////////////////
////////////// RECUPERE ID DANS URL //////////////////////
//////////////////////////////////////////////////////////
const urlID = window.location.search;
const urlSearchParams = new URLSearchParams(urlID);
const id = urlSearchParams.get("id");

//////////////////////////////////////////////////////////
// SELECTIONNE DANS HTML TOUTES LES BALISES NECESSAIRES //
////////// A LA CONSTRUCTION DE LA PAGE PRODUCT //////////
//////////////////////////////////////////////////////////
const image = document.querySelector('.item__img');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const select = document.querySelector("select");
const input = document.querySelector("input");
const panier = document.getElementById("addToCart");

//////////////////////////////////////////////////////////
/////////// CREE UN OBJET QUI RASSEMBLE TOUTES ///////////
///////////// LES VALEURS DU CANAPE CHOISIS //////////////
//////////////////////////////////////////////////////////
let canapToAdd = {
    idCanap: "",
    imgCanap: "",
    altCanap: "",
    nomCanap: "",
    couleurCanap: "",
    nombreCanap: "",
};

main();

function main() {
    buildProduct();
    addToCart();
}
//////////////////////////////////////////////////////////
/////// RECUPERE LE CANAPE CHOISIS DANS L'INDEX A ////////
////////// PARTIR DE L'ID DANS LA BAS DE DONNEE //////////
// AJOUTE LES VALEURS DU CANAPE CHOISIS DANS canapToAdd //
///////// CREE LA PAGE PRODUCT DE FACON DYNAMIQUE ////////
//////////////// SELON LE CANAPE CHOISIS /////////////////
/////// AJOUTE A canapToAdd LES VALEURS DE COULEUR ///////
//////// ET DE NOMBRE SELON LE CHOIX UTILISATEUR /////////
//////////////////////////////////////////////////////////
function buildProduct() {
    const img = document.createElement('img');

    fetch(`http://localhost:3000/api/products/${id}`).then(async (response) => {
        const canap = await response.json();
        
        canapToAdd["idCanap"] = canap._id;
        canapToAdd["imgCanap"] = canap.imageUrl;
        canapToAdd["altCanap"] = canap.altTxt;
        canapToAdd["nomCanap"] = canap.name;
    
        img.src = canap.imageUrl;
        img.alt = canap.altTxt;
        title.textContent = canap.name;
        price.textContent = canap.price;
        description.textContent = canap.description;
    
        image.appendChild(img);
    
        canap.colors.forEach((color) => {
            const optn = document.createElement('option');
    
            optn.value = color;
            optn.textContent = color;
    
            select.appendChild(optn);
        });
    });
    
    select.addEventListener("input", (e) => {
        canapToAdd["couleurCanap"] = e.target.value;
    });
    input.addEventListener("input", (e) => {
        canapToAdd["nombreCanap"] = Number(e.target.value);
    });
}

//////////////////////////////////////////////////////////
///////////// RECUPERE LES PRODUITS DU LS ////////////////
/////////// POUR LES METTRE DANS UNE VARIABLE ////////////
//// EMPECHE AJOUT DU CANAPE SI AUCUNE COULEUR CHOISIS ///
//// EMPECHE AJOUT DU CANAPE SI AUCUN NOMBRE CHOISIS /////
///// SI LE CANAPE EXISTE DEJA MET A JOUR LA QUANTITE ////
///////////// SINON AJOUTE LE CANAPE AU LS ///////////////
//////////////////////////////////////////////////////////
function addToCart() {  
    panier.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem("produit"));
        const input = document.querySelector("input");
    
        if(canapToAdd.couleurCanap === ""){
            alert("Choisissez une couleur de canapé")
        }
        else 
        if(canapToAdd.nombreCanap === "" || canapToAdd.nombreCanap < 1){
            alert("ajouter au moins 1 canapé");
        }
        else if (cart) {
            let find = false;
            for(i = 0; i < cart.length; i++) {
                if (cart[i].idCanap === canapToAdd.idCanap && cart[i].couleurCanap === canapToAdd.couleurCanap){
                        cart[i].nombreCanap = cart[i].nombreCanap + Number(input.value);
                        find = true;
                }
            }
            if (find === false) {
                cart.push(canapToAdd);
            }
            localStorage.setItem("produit", JSON.stringify(cart)); 
        } else {
            let cart = [];
            cart.push(canapToAdd)
            localStorage.setItem("produit", JSON.stringify(cart)); 
        };
    });
}