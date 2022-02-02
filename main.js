const SORT_ATTRIBS = {
    FIRSTNAME: "first name",
    LASTNAME: "last name",
    MOVIE: "movie"
}

let currentSorting;
let currentlyAscending = false;
let actorList;

window.onload = () => {
    loadActorList("resources/actors.json")
        .then(actors => {
            actorList = actors;
            toggleSort(SORT_ATTRIBS.FIRSTNAME)
        })
}

async function loadActorList(url){
    const response = await fetch(url, { mode: 'no-cors'})
    .then(data => { return data.json() } );
    
    return response;
}

function toggleSort(attribute){
    if (currentSorting == attribute){
        currentlyAscending = !currentlyAscending;
    } else {
        currentSorting = attribute;
        currentlyAscending = true;
    }

    let hintText = "Currently sorted by: " + attribute;
    if(currentlyAscending){
        hintText += ", ascending"
    } else {
        hintText += ", descending"
    }
    sortList(attribute, currentlyAscending, actorList);
    createActorHtmlList(actorList);
    sortingHint = document.getElementById("sorting-hint");
    sortingHint.textContent = hintText
}

function sortList(attribute, ascending, actorList){
    return actorList.sort(function(a,b) {
        let attribA;
    
        let attribB;
        switch (attribute) {
            case SORT_ATTRIBS.FIRSTNAME:
                attribA = a.fullname.split(" ")[0].toUpperCase();
                attribB = b.fullname.split(" ")[0].toUpperCase();
                break;
            case SORT_ATTRIBS.LASTNAME:
                attribA = getLastname(a.fullname).toUpperCase();
                attribB = getLastname(b.fullname).toUpperCase();
                break;
            case SORT_ATTRIBS.MOVIE:
                attribA = a.movie.toUpperCase();
                attribB = b.movie.toUpperCase();
                break;
        }

        if (ascending){
            return compareAscending(attribA, attribB);
        } else {
            return compareDescending(attribA, attribB);
        }
    });
}

function getLastname(fullname){
    names = fullname.split(" ");
    return names[names.length - 1];
}

function compareAscending(attribA, attribB){
    if (attribA < attribB){
        return -1;
    }

    if (attribA > attribB){
        return 1;
    }

    return 0;
}

function compareDescending(attribA, attribB){
    if (attribA > attribB){
        return -1;
    }

    if (attribA < attribB){
        return 1;
    }

    return 0;
}

function openModal(actorName, movie){
    modal = document.getElementById("detail-info");
    titleElem = document.querySelector("#detail-info>h2");
    textElem = document.querySelector("#detail-info>p");

    titleElem.textContent = actorName;
    textElem.textContent = "plays in the movie: " + movie;
    modal.style.display = "flex";
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      } 
    console.log("called with" + actorName);
}

function closeModal(){
    console.log("called close");
    modal = document.getElementById("detail-info");
    modal.style.display = "none";
    body.onclick = null;
}


function createActorHtmlList(actors){
    parentList = document.getElementById("actor-list");
    listElems = [];
    actors.forEach(actor => {
        let name = document.createElement("h3");
        name.textContent = actor.fullname;
        let movie = document.createElement("p");
        movie.textContent = actor.movie;
        let listItem = document.createElement("li");
        listItem.onclick = function () { openModal(actor.fullname, actor.movie) }
        listItem.appendChild(name);
        listItem.appendChild(movie);
        listElems.push(listItem);
    });

    parentList.replaceChildren(...listElems);
}