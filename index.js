//Html id's
const searchBtn = document.getElementById('search__btn');
const searchBar = document.getElementById('search__input');
const prevoius = document.getElementById('previous__page');
const next = document.getElementById('next__page');
const imageList = document.getElementById('image__list');
const largeImage = document.getElementById('large__image');
const settingsMenu = document.getElementById('settings__menu');
const clearBtn = document.getElementById('clear__page');
const infoPage = document.getElementById('info__page');
const infoPages = document.getElementById('info__pages');
const infoResults = document.getElementById('info__results');
const searchInfo = document.getElementById('search__info');
const topBtn = document.getElementById('topBtn');

//Variables regarding the base url and personal access-key
const baseUrl = 'https://api.flickr.com/services/rest';
const key = '2ada3c950c3dc4d266dc27cdfd98a53c';

//Variables regarding search-settings for the url
let page = 1;
let perPage = 20;
let sort = 'relevance';

async function fetchApi(query) {

    //Url specific for the purpouse of image search, with some optional extras
    const methodUrl = `?method=flickr.photos.search&api_key=${key}&text=${query}`
        + `&per_page=${perPage}&page=${page}&sort=${sort}&get_user_info=1&`
        + `extras=date_taken,description,tags,views&format=json&nojsoncallback=1`;

    //Fetch the api with the base url for flickr, and specific url for image search
    const response = await fetch(baseUrl + methodUrl);

    //If fetch was successful
    if (response.ok) {

        //Log some info on the fetch
        console.log(`"${query}", Page ${page}, ${perPage}/page, Sort: ${sort}`);
    }

    //Saving the response in json
    const data = await response.json();

    //Run function with the data from our response
    renderImages(data.photos.photo);

    //Show some info in settings menu
    infoPage.innerHTML = `Page: ${data.photos.page}.`;
    infoPages.innerHTML = `Pages: ${data.photos.pages}.`;
    infoResults.innerHTML = `Results: ${parseFloat(data.photos.total)}.`;
}

//Check for click
searchBtn.addEventListener('click', () => {

    //Reset page to 1
    page = 1;

    submitQuery();
})

function submitQuery() {

    //If something is written in the search-bar
    if (searchBar.value.length >= 1) {

        //Clear page from image-gallery
        imageList.innerHTML = '';

        //Hide button
        topBtn.classList = 'hide';

        clearPage();

        //Saving our query
        query = searchBar.value;

        //Run function with our query
        fetchApi(query);
    }
}

function clearPage() {

    //Clear large image
    largeImage.innerHTML = '';

    //Hide button
    clearBtn.classList = 'hide';
}

function renderImages(images) {

    //For each image in images-array
    for (i = 0; i < images.length; i++) {

        //Create list element
        let newListElement = document.createElement('li');

        //Add image tag + src
        newListElement.innerHTML = `<img id="${i}" src="https://farm${images[i].farm}.staticflickr.com/`
            + `${images[i].server}/${images[i].id}_${images[i].secret}_q.jpg" alt="${images[i].title}">`;

        //Append new element to our ul
        imageList.append(newListElement);
    };

    //Show button
    topBtn.classList -= 'hide';

    //Check for click
    imageList.addEventListener('click', (e) => {

        //Only if one of the images are being clicked
        if (e.target.toString().includes('[object HTMLImageElement]') && images[e.target.id] != undefined) {

            //Change image format to 'b' instead of 'q'
            let newSrc = e.target.src.replace('q', 'b');

            //Add the img tag with the new url for displaying the bigger image + info about it
            largeImage.innerHTML = `<img src="${newSrc}" alt="${images[e.target.id].title}">`
                + `<h3>Title: ${images[e.target.id].title}</h3>`
                + `<p>Description: ${images[e.target.id].description._content}</p>`
                + `<p>Date taken: ${images[e.target.id].datetaken}</p>`
                + `<p>Tags: ${images[e.target.id].tags}</p>`
                + `<p>Views: ${images[e.target.id].views}st</p>`;

            //Show button
            clearBtn.classList -= 'hide';

            scrollToTop();
        }
    })
}

function scrollToTop() {

    //Scroll to the top of the HTML doc'
    document.documentElement.scrollTop = 0;
}

function showSettings() {

    //Toggle the settings menu
    settingsMenu.classList.toggle('hide');
    searchInfo.classList.toggle('hide');
}

function previousPage() {

    //Check if page-number was already increased
    if (page > 1) {

        //Decrease page-number
        page -= 1;

        submitQuery();
    }
}

function nextPage() {

    //Increase page-number
    page += 1;

    submitQuery();
}

//Check for click on settings menu
settingsMenu.addEventListener('click', (e) => {

    //If one of the buttons with numbers are being pressed
    if (e.target.innerHTML == 20 || e.target.innerHTML == 50 || e.target.innerHTML == 75) {

        //Increase results per page
        perPage = parseInt(e.target.innerHTML);

        //Reset page to 1
        page = 1;

        submitQuery();
    }

    //If button 'relevant' is pressed
    if (e.target.innerHTML == 'RELEVANT') {

        //Change sort to relevance
        sort = 'relevance';

        page = 1;

        submitQuery();
    }

    //If button 'new' is pressed
    if (e.target.innerHTML == 'NEW') {

        //Change sort to new
        sort = 'date-posted-desc';

        page = 1;

        submitQuery();
    }

    //If button 'new' is pressed
    if (e.target.innerHTML == 'HOT') {

        //Change sort to new
        sort = 'interestingness-desc';

        page = 1;

        submitQuery();
    }
})