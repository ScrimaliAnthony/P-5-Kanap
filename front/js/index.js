main();

function main() {
    buildCatalog();
}
//////////////////////////////////////////////////////////
/////// RECUPERE LES CANAPE DANS LA BAS DE DONNEE ////////
///////// CREE DES BALISES HTML AVEC JAVASCRIPT //////////
///////// LEURS DONNES LES VALEURS NECESSAIRES ///////////
//////////////// CONSTRUIT LA PAGE HTML //////////////////
//////////////////////////////////////////////////////////
function buildCatalog() {
    fetch("http://localhost:3000/api/products").then(async (response) => {
        const canaps = await response.json();
        
        canaps.forEach((canap) => {
            const item = document.getElementById("items");
            const a = document.createElement('a');
            const article = document.createElement('article');
            const img = document.createElement('img');
            const h3 = document.createElement('h3');
            const p = document.createElement('p');
            
            a.href = "product.html" + "?id=" + canap._id;
            img.src = canap.imageUrl;
            img.alt = canap.altTxt;
            h3.classList = "productName";
            h3.textContent = canap.name;
            p.classList = "productDescription";
            p.textContent = canap.description;
            
            item.appendChild(a);
            a.appendChild(article);
            article.appendChild(img);
            article.appendChild(h3);
            article.appendChild(p);
        });
    });
}