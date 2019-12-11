const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const key = 'YozfclgKkvSV7pr3qIhtOq9tyF1LPEqA';
let url;

//SEARCH FORM
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

//RESULTS SECTION
const section = document.querySelector('section');

// Inital NAV display will be none because we do not want these showing before search
nav.style.display = 'none';

let pageNumber = 0;
console.log('Page number: ', pageNumber)
let displayNav = false;

searchForm.addEventListener('submit', fetchResults);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);


function fetchResults(e) {
    e.preventDefault();
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value;
    console.log('URL: ', url)
    if(startDate.value !== '') {
        console.log(startDate.value)
      url += '&begin_date=' + startDate.value;
    };
  
    if(endDate.value !== '') {
      url += '&end_date=' + endDate.value;
    };
    fetch(url).then(function(result){
        return result.json();
    }).then(function(json) {
        displayResults(json);
    })
  }

  function displayResults(json) {
    let articles = json.response.docs;

    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }

    if(articles.length === 10 && pageNumber > 0) {
        nav.style.display = 'block';
        previousBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    } 
    else if(articles.length === 10 && pageNumber === 0){
        nav.style.display = 'block';
        previousBtn.style.display = 'none';
        nextBtn.style.display = 'block';
    }
    else if(articles.length > 0 && articles.length < 10 && pageNumber === 0) {
        nav.style.display = 'none';
        previousBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
    else if(articles.length > 0 && articles.length < 10 && pageNumber > 0 ) {
        nav.style.display = 'block';
        previousBtn.style.display = 'block';
        nextBtn.style.display = 'none';
    }
    else {
        nav.style.display = 'none';
    };
    
    if(articles.length === 0){
        console.log('No results')
    } else {
    for(let i = 0; i < articles.length; i++) {
    let article = document.createElement('article');
    let heading = document.createElement('h2');
    let link = document.createElement('a');
    let img = document.createElement('img');
    let para = document.createElement('p');
    let clearfix = document.createElement('div');

    let current = articles[i];
    console.log('Current: ', current);

    link.href = current.web_url;
    link.textContent = current.headline.main;

    para.textContent = 'Keywords: ';

    for(let j = 0; j < current.keywords.length; j++) {
        let span = document.createElement('span')
        span.textContent = current.keywords[j].value + ' ';
        para.appendChild(span);
    }

    if(current.multimedia.length > 0){
        img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
        img.alt = current.headline.main;
    }


    clearfix.setAttribute('class', 'clearfix');
    
    article.appendChild(heading);
    heading.appendChild(link);
    article.appendChild(para);
    article.appendChild(clearfix);
    section.appendChild(article);
     }
    }
  };
  
  function nextPage(e){
    pageNumber++;
    fetchResults(e);
    console.log('Page Number:', pageNumber);
  }
  
  function previousPage(e){
      if(pageNumber > 0){
          pageNumber--;
      } else {
          return;
      }
      fetchResults(e);
    console.log('Page Number:', pageNumber);
  }

