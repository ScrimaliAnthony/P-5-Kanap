main();

function main() {
  buildCart();
  sendConfirmation();
}
///////////////////////////////////////////////////
///////// SUPPRIME LE CANAPE SELECTIONNE //////////
////////// EN CREANT UN NOUVEAU TABLEAU ///////////
////// METANT DEDANS UNIQUEMENT LES CANAPES ///////
//////// DIFFERENTS DE CELUI A SUPPRIMER //////////
/////// EFFACE LE CONTENU DU localStorage /////////
/// MET LE NOUVEAU TABLEAU DANS LE localStorage ///
///////// EFFACE LES ELEMENTS CREE DANS ///////////
//////////// LA FONCTION buildCart ////////////////
/////// CONTROLL LA TAILLE DU localStorage ////////
/// SI VIDE SUPPRIME L'ENTIERETE DE SON CONTENUE //
////////// APPEL LA FONCTION buildCart ////////////
///////////////////////////////////////////////////
function deleteCanap(suppr, cart) {
  let targetCanap = suppr.closest('article');
  let newCart = [];
  for(i = 0; i < cart.length; i++){
    if(targetCanap.dataColor != cart[i].couleurCanap || targetCanap.id != cart[i].idCanap){
      newCart.push(cart[i]);
    };
  };
  localStorage.clear();
  localStorage.setItem("produit", JSON.stringify(newCart));
  const removeCanaps = document.querySelectorAll('article');
  removeCanaps.forEach(removeCanap => {
    removeCanap.remove();
  });
  const controll = JSON.parse(localStorage.getItem("produit"));
  if(controll.length === 0) {
    localStorage.removeItem('produit')
  }
  buildCart();
}
///////////////////////////////////////////////////
/////////// CHANGE LE NOMBRE DE CANAPE ////////////
/////// EFFACE LE CONTENU DU localStorage /////////
//// MET cart MIS A JOUR DANS LE localStorage /////
///////// EFFACE LES ELEMENTS CREE DANS ///////////
//////////// LA FONCTION buildCart ////////////////
////////// APPEL LA FONCTION buildCart ////////////
///////////////////////////////////////////////////
function updateQuantity(e, nbCanap, cart) {
  let targetNb = Number(e.target.value);
  let targetCanap = nbCanap.closest('article');
  for(i = 0; i < cart.length; i++){
    if(targetCanap.dataColor === cart[i].couleurCanap && targetCanap.id === cart[i].idCanap){
      cart[i].nombreCanap = targetNb;
    };
  };
  localStorage.clear();
  localStorage.setItem("produit", JSON.stringify(cart));
  const removeCanaps = document.querySelectorAll('article');
  removeCanaps.forEach(removeCanap => {
    removeCanap.remove();
  });
  buildCart();
}
///////////////////////////////////////////////////
/////// CONSTRUIT LA PAGE HTML ET L'AFFICHE ///////
///////////////////////////////////////////////////
function buildCart() {
  let cart = JSON.parse(localStorage.getItem("produit"));
  
  if(cart === null) {
    const section = document.querySelector('#cart__items');
    const vide = document.createElement('p');
    vide.textContent = " Le panier est vide";
    section.appendChild(vide);
    totalQuantity.textContent = Number('');
    totalPrice.textContent = Number('');

  } else {
    let quantity = 0;
    let price = 0;
    cart.forEach(produit => {

      const section = document.querySelector('#cart__items');

      const article = document.createElement('article');
      const nomCanap = document.createElement('h2');
      const nombreCanap = document.createElement('input');
      const imgCanap = document.createElement('img');
      const div_1 = document.createElement('div');
      const div_2 = document.createElement('div');
      const div_3 = document.createElement('div');
      const div_4 = document.createElement('div');
      const div_5 = document.createElement('div');
      const div_6 = document.createElement('div');
      const couleurCanap = document.createElement('p');
      const prixCanap = document.createElement('p');
      const p_3 = document.createElement('p');
      const p_4 = document.createElement('p');

        article.classList = "cart__item";
        article.id = produit.idCanap;
        article.setAttribute('data-color', produit.couleurCanap);
        article.dataColor = produit.couleurCanap;
        div_1.classList = "cart__item__img";
        imgCanap.src = produit.imgCanap;
        imgCanap.alt = produit.altCanap;
        div_2.classList = "cart__item__content";
        div_3.classList = "cart__item__content__description";
        nomCanap.textContent = produit.nomCanap;
        couleurCanap.textContent = produit.couleurCanap;

        fetch(`http://localhost:3000/api/products/`).then(async (response) => {
          const canaps = await response.json();
          canaps.forEach(canap => {
            if(canap._id === article.id){
              prixCanap.textContent = canap.price;
              price = price + canap.price * produit.nombreCanap;
              totalPrice.textContent = Number(price);
            };
          });
        });

        div_4.classList = "cart__item__content__settings";
        div_5.classList = "cart__item__content__settings__quantity";
        p_3.textContent = "Qté : ";
        nombreCanap.type = "number";
        nombreCanap.classList = "itemQuantity";
        nombreCanap.name = "itemQuantity";
        nombreCanap.min = 1;
        nombreCanap.max = 100;
        nombreCanap.value = produit.nombreCanap;
        div_6.classList = "cart__item__content__settings__delete";
        p_4.classList = "deleteItem";
        p_4.textContent = "Supprimer";

      section.appendChild(article);
        article.appendChild(div_1);
          div_1.appendChild(imgCanap);
        article.appendChild(div_2);
          div_2.appendChild(div_3);
            div_3.appendChild(nomCanap);
            div_3.appendChild(couleurCanap);
            div_3.appendChild(prixCanap);
          div_2.appendChild(div_4);
            div_4.appendChild(div_5)
              div_5.appendChild(p_3);
              div_5.appendChild(nombreCanap);
            div_4.appendChild(div_6);
              div_6.appendChild(p_4);

      quantity = quantity + produit.nombreCanap;
      totalQuantity.textContent = Number(quantity);
    });



    const supprimer = document.querySelectorAll(".deleteItem");
    supprimer.forEach(suppr => {
      suppr.addEventListener('click', () => {
        deleteCanap(suppr, cart);
      });
    });

    const nombreCanap = document.querySelectorAll('.itemQuantity')
    nombreCanap.forEach(nbCanap => {
      nbCanap.addEventListener('input', (e) => {
        updateQuantity(e, nbCanap, cart);
      });
    });
  };
}
///////////////////////////////////////////////////
//////// CREE DES REGEX POUR CHAQUES LIGNE ////////
//////////////// DU FORMULAIRE ////////////////////
///////////// ENVOIE LE FORMULAIRE ////////////////
///////////////////////////////////////////////////
function sendConfirmation() {
  let cart = JSON.parse(localStorage.getItem("produit"));
  let cartValidation = new Boolean();

  const firstName = document.querySelector('#firstName');
  const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
  let firstNameValidation = new Boolean();
  firstNameValidation = false;

  firstName.addEventListener('change', () => {
    firstNameErrorMsg.textContent = '';
    const firstNameValid = new RegExp(
      '^[A-Z]{1}[a-z]+$', 'g'
    );
    const firstNameTest = firstNameValid.test(firstName.value);
    if(firstNameTest) {
      firstNameValidation = true;
    } else {
      firstNameValidation = false;
      firstNameErrorMsg.textContent = 'Commence par une majuscule, ne dois contenir ni chiffres, ni accent, ni caractère spéciaux'
    };
  });

  const lastName = document.querySelector('#lastName');
  const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
  let lastNameValidation = new Boolean();
  lastNameValidation = false;

  lastName.addEventListener('change', () => {
    lastNameErrorMsg.textContent = '';
    const lastNameValid = new RegExp(
      '^[A-Z]{1}[a-z]+$', 'g'
    );
    const lastNameTest = lastNameValid.test(lastName.value);
    if(lastNameTest) {
      lastNameValidation = true;
    } else {
      lastNameValidation = false;
      lastNameErrorMsg.textContent = 'Commence par une majuscule, ne dois contenir ni chiffres, ni accent, ni caractère spéciaux';
    };
  });

  const address = document.querySelector('#address');
  const addressErrorMsg = document.querySelector('#addressErrorMsg');
  let addressValidation = new Boolean();
  addressValidation = false;

  address.addEventListener('change', () => {
    addressErrorMsg.textContent = '';
    const addressValid = new RegExp(
      '^[0-9]+[a-zA-Z, ]+$', 'g'
    );
    const addressTest = addressValid.test(address.value);
    if(addressTest) {
      addressValidation = true;
    } else {
      addressValidation = false;
      addressErrorMsg.textContent = 'Commence par un chiffre puis une suite de lettre';
    };
  });

  const city = document.querySelector('#city');
  const cityErrorMsg = document.querySelector('#cityErrorMsg');
  let cityValidation = new Boolean();
  cityValidation = false;

  city.addEventListener('change', () => {
    cityErrorMsg.textContent = '';
    const cityValid = new RegExp(
      '^[A-Za-z- ]+$', 'g'
    );
    const cityTest = cityValid.test(city.value);
    if(cityTest) {
      cityValidation = true;
    } else {
      cityValidation = false;
      cityErrorMsg.textContent = 'Ne dois pas contenir de chiffres';
    };
  });

  const email = document.querySelector('#email');
  const emailErrorMsg = document.querySelector('#emailErrorMsg');
  let emailValidation = new Boolean();
  emailValidation = false;

  email.addEventListener('change', () => {
    emailErrorMsg.textContent = '';
    const emailValid = new RegExp(
      '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g'
    );
    const emailTest = emailValid.test(email.value);
    if(emailTest) {
      emailValidation = true;
    } else {
      emailValidation = false;
      emailErrorMsg.textContent = 'adress mail doit comporter @ et .';
    };
  });

  const buttonOrder = document.querySelector('#order');

  buttonOrder.addEventListener('click', () => {

    if(JSON.parse(localStorage.getItem("produit") === null)) {
      cartValidation = false;
    } else {
      cartValidation = true;
    }

    if(cartValidation === false) {
      alert('Votre panier est vide')
    } else 
    if(firstNameValidation === false) {
      alert('Ajoutez un prénom valide');
    } else if (lastNameValidation === false) {
      alert('Ajoutez un nom de famille valide');
    } else if (addressValidation === false) {
      alert('Ajoutez une adress valide');
    } else if (cityValidation === false) {
      alert ('Ajoutez un nom de ville valide');
    } else if (emailValidation === false) {
      alert('Ajoutez une adress mail valide');
    } else {
      let canapIdArray = [];
      cart.forEach((canap) => {
        for(let i = 0; i < canap.nombreCanap; i++) {
          canapIdArray.push(canap.idCanap);
        };
      });
      let order = {
        contact: {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        },
        products: canapIdArray,
      };
      const fetchOption = {
        method: 'POST',
        body : JSON.stringify(order),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      fetch(`http://localhost:3000/api/products/order`, fetchOption).then(async (response) => {
        order = await response.json();
        const orderId = order.orderId;
        localStorage.clear();
        localStorage.setItem('orderId', orderId);
        document.location.href = "confirmation.html" + "?orderID=" + orderId;
      });
    }
  });
}