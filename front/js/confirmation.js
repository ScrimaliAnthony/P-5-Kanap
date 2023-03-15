main();

function main() {
    orderId();
}
///////////////////////////////////////////////////
/////// RECUPERE orderId DANS LocalStorage ////////
////////////////// ET L'AFFICHE ///////////////////
///////////////////////////////////////////////////
function orderId() {
    const LS = localStorage.getItem('orderId');
    const orderId = document.querySelector('#orderId');

    orderId.textContent = LS;

    localStorage.clear();
}