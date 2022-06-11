const API_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search?limit=3&format=json&api_key=482ba3ac-fca4-442a-8dff-65444d3826e6';
const API_URL_FAVORITES = 'https://api.thedogapi.com/v1/favourites?limit=3?limit=3&api_key=482ba3ac-fca4-442a-8dff-65444d3826e6';
const API_URL_FAVOTITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}?api_key=482ba3ac-fca4-442a-8dff-65444d3826e6`;

const spanError = document.getElementById("error");

/* fetch */
async function loadRandomDogsFetch() {
    console.log('Favorites fetch');
    fetch(API_URL_RANDOM)
        .then(res => res.json())
        .then(data => {
            /* Dog Random */
            addCards(data);
        })
        .catch(err => console.error(err));
}

/* async */
async function loadRandomDogsAwait() {
    try {
        console.log('Random await');
        const response = await fetch(API_URL_RANDOM);
        const data = await response.json();
        if (response.status !== 200) {
            error.innerHTML = "Hubo un error " + res.status;
        } else {
            addCards(data);
        }
    } catch (error) {
        console.error(error)
    }

}

/* FAVORITES */
async function loadfavoritesDogs() {
    try {
        console.log('Favorites await');
        const response = await fetch(API_URL_FAVORITES);
        const data = await response.json();
        if (response.status !== 200) {
            error.innerHTML = "Error " + response.status + ' - ' + data.message;
        } else {
            if (data.length > 0) {
                const cards = document.querySelector("#favorites .cards");
                cards.innerHTML ="";
                addFavoriteCards(data)
            } else {
                addMessage('favorites');
            }
        }
    } catch (error) {
        console.error(error)
    }
}

async function saveFavoriteDogs(id) {
    try {
        const response = await fetch(API_URL_FAVORITES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_id: id 
            })
        });
        const data = await response.json();
        if (response.status !== 200) {
            spanError.innerHTML = "Hubo un error: " + response.status + data.message
        }else{
            loadfavoritesDogs();
            showModal(true);
        }
    } catch (error) {
        console.log("Error " , error);
    }
}

async function deleteFavoriteDog(id) {
    try {
        const response = await fetch(API_URL_FAVOTITES_DELETE(id), {
            method: 'DELETE'
        });
        const data = await response.json();
        if(response.status !==200){
            spanError.innerHTML = "Hubo un error: " + response.status + data.message
        }else{
            loadfavoritesDogs();
            showModal(false);
        }
    } catch (error) {
        console.log("Error" , error);
    }
}
function addCards(data) {
    const img1 = document.querySelector("#random .cards :nth-child(1) .card-img img");
    const img2 = document.querySelector("#random .cards :nth-child(2) .card-img img");
    const img3 = document.querySelector("#random .cards :nth-child(3) .card-img img");
    const name1 = document.querySelector("#random .cards :nth-child(1) .card-text p")
    const name2 = document.querySelector("#random .cards :nth-child(2) .card-text p")
    const name3 = document.querySelector("#random .cards :nth-child(3) .card-text p")
    img1.src = data[0].url;
    img2.src = data[1].url;
    img3.src = data[2].url;
    name1.innerHTML = data[0].breeds[0] ? data[0].breeds[0].name : "Doggie";
    name2.innerHTML = data[1].breeds[0] ? data[1].breeds[0].name : "Doggie";
    name3.innerHTML = data[2].breeds[0] ? data[2].breeds[0].name : "Doggie";

    const btn1 = document.querySelector("#random .cards :nth-child(1) .card-img span");
    const btn2 = document.querySelector("#random .cards :nth-child(2) .card-img span");
    const btn3 = document.querySelector("#random .cards :nth-child(3) .card-img span");
    btn1.onclick = () => saveFavoriteDogs(data[0].id);
    btn2.onclick = () => saveFavoriteDogs(data[1].id);
    btn3.onclick = () => saveFavoriteDogs(data[2].id);
}

function prueba(){
    console.log('Prueba');
}
function addFavoriteCards(data) {
    data.forEach(dog => {
        const cards = document.querySelector("#favorites .cards");
        const card = document.createElement("div");
        card.className = "card";
        const cardImg = document.createElement("div");
        cardImg.className = "card-img";
        const img = document.createElement("img");
        const icon = document.createElement("span");
        icon.className = "fa-solid fa-heart love";
        icon.onclick = () => deleteFavoriteDog(dog.id);
        img.src = dog.image.url;

        cardImg.appendChild(icon)
        cardImg.appendChild(img);
        card.appendChild(cardImg);
        cards.appendChild(card);
        
    });
}

function addMessage(id) {
    const section = document.querySelector("#" + id);
    const h1 = document.createElement("h1");
    h1.innerHTML = "Don't have favorites dogs yet :(";
    h1.className = "message";
    section.appendChild(h1);
}

function showModal(addFavorite){
    const textSuccess = "Successfully added to favorites";
    const textUnsuccess = "Successfully eliminated";
    const iconHeard = "success fa-solid fa-heart";
    const iconHeardBroke = "wrong fa-solid fa-heart-crack";
    const modal = document.querySelector(".modal");
    const btnClose = document.querySelector(".modal .close");
    btnClose.onclick = function() {
        modal.style.display = "none";
    }
    const modalMessage = document.querySelector(".modal .modal-content .modal-message");
    const icon = document.querySelector(".modal .modal-content :nth-child(3)");
    if(addFavorite){
        modalMessage.innerHTML = textSuccess;
        icon.className = iconHeard;
    }else{
        modalMessage.innerHTML = textUnsuccess;
        icon.className = iconHeardBroke;
    }
    modal.style.display = "block";
}

function closeModal(){
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
}

loadRandomDogsFetch();
loadfavoritesDogs();