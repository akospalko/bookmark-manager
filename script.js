/* -------VARIABLES------- */ 
//DOM elements
const openModalBtn = document.getElementById('bookmark-button'); //h1 //open the modal window
const closeModalBtn = document.getElementById('close-modal-button');
const modal = document.getElementById('modal-container');
//For building DOM elements
const bookmarkContainer = document.getElementById('bookmark-container');
//Form
const form = document.getElementById('form-container');
const websiteNameElement = document.getElementById('website-name'); //input for website name
const websiteURLElement = document.getElementById('website-url'); //input for website URL
//Local storage container
let bookmarks = [];

/* ------FUNCTIONALITIES------ */ 
//Activate modal by adding a secondary class to modal(show-modal). 
//In css we use flexbox:display to display modal.
function openModalWindow() {
    modal.classList.add('show-modal'); 
    websiteNameElement.focus();
}
//Validate form using regex
function validateURL(websiteName, websiteURL) {
    //create regex obj
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const regex = new RegExp(expression);
    //check if either form is empty
    if(!websiteName || !websiteURL){
        alert('Please fill in both fields.');
        return false;
    }
    //match regex
    if(!websiteURL.match(regex)){
        alert('The URL you entered is incorrect. Try again!');
        return false;
    }
    return true;
}

//Build bookmarks DOM
function buildBookmarks() {
    //reset bookmark content to avoid duplicate bookmarks
    bookmarkContainer.textContent = '';
    //build DOM
    bookmarks.forEach((bookmark) => {
        //destructuring bookmark
        const{name, url} = bookmark;
        //build item
        const item = document.createElement('div');
        item.classList.add('item');
        //close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-skull');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`); // delete bookmark
        //bookmark info (favicon and link):
        const bookmarkInfo = document.createElement('div');
        bookmarkInfo.classList.add('bookmark-info');
        //favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('title', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        //append elements to bookmark-container
        bookmarkInfo.append(favicon, link);
        item.append(closeIcon, bookmarkInfo);
        bookmarkContainer.appendChild(item);
    });
}

//Local storage - get data
function getBookmarks() {
    //access bookmarks if available
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
      //assign sample bookmark to  local storage
        bookmarks = [
            {
            name:'github',
            url: 'https://github.com/',
            },
        ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}
//Handle input(form) data
function storeBookmark(e) {
    e.preventDefault(); 
    const websiteName = websiteNameElement.value;
    let websiteURL = websiteURLElement.value;
    //add http/s to URLs
    if(!websiteURL.includes('https://') && !websiteURL.includes('http://'))
        websiteURL = `https://${websiteURL}`;
    //regex validation
    if(!validateURL(websiteName, websiteURL)) { 
        return false;
    }
    //create objects for bookmarks
    const bookmark = {
        name: websiteName,
        url: websiteURL,
    };
    //push input bookmark into the array
    bookmarks.push(bookmark);
    //reset input field to its default state
    form.reset();
    //set up the local storage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    //get existing bookmarks
    getBookmarks();
}
//Delete bookmarks
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url){
            bookmarks.splice(i, 1); 
    }
    });
    //local storage - update
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    //DOM - update 
    getBookmarks();
}

/* -------EVENT LISTENERS------- */ 
// Modal open/close
openModalBtn.addEventListener('click', openModalWindow);
closeModalBtn.addEventListener('click', () => modal.classList.remove('show-modal'));
//close modal when clicking on window obj (overlay)
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal'): false ); 
//Submitting form
form.addEventListener('submit', storeBookmark);


//On load, get existing bookmarks from local storage
getBookmarks();
