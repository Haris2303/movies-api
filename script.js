// ajax
// function getDataApiOMDB(url, success, err) {
//     let xhr = new XMLHttpRequest();

//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 success(xhr.response);
//             } else if (xhr.status === 404) {
//                 err();
//             }
//         }
//     }

//     xhr.open('get', url);
//     xhr.send();
// }

// // ambil element
// const btnSearchMovie = document.querySelector('.search-movie-button');
// const keywordNameMovie = document.querySelector('.keyword-name-movie');

// // jika tombol search diklik
// btnSearchMovie.addEventListener('click', function() {
//     getDataApiOMDB('http://www.omdbapi.com/?s=' + keywordNameMovie.value + '&apikey=49cd3c81', results => {
//         // const parseJson = JSON.parse(results);
//         const movies = JSON.parse(results).Search;
//         let cards = '';
//         movies.forEach(m => {
//             cards += showMovies(m);
//         });

//         // ubah isi movie-container 
//         document.querySelector('.movie-container').innerHTML = cards;

//         // ambil modal-detail-botton
//         const detailMovies = document.querySelectorAll('.modal-detail-button');

//         // destructuring dan looping detail movies
//         [...detailMovies].map(dm => dm.addEventListener('click', function() {
//             // ambil id dari data-imdbid
//             const id = (this).getAttribute('data-imdbid');
//             // lakukkan ajax asynchronous
//             getDataApiOMDB('http://www.omdbapi.com/?i=' + id + '&apikey=49cd3c81', values => {
//                 const m = JSON.parse(values);
//                 const detailMovies = showDetailMovie(m);

//                 // ubah isi modal-body 
//                 document.querySelector('.modal-body').innerHTML = detailMovies;
//             })
//         }))

//     }, err => console.log(err.responseText));
// })



// fetch
// ambil element 
// const movieContainer = document.querySelector('.movie-container');
// const searchbtn = document.querySelector('.search-movie-button');
// const searchKeyword = document.querySelector('.keyword-name-movie');

// // jika tombol search diklik
// searchbtn.addEventListener('click', function() {
//     // ambil inputan dari user
//     const inputanUser = searchKeyword.value;
//     // jalankan fetch
//     fetch('http://www.omdbapi.com/?s=' + inputanUser + '&apikey=49cd3c81')
//         .then(response => response.json())
//         .then(response => {
//             const movies = response.Search;
//             let cards = '';
//             movies.forEach(m => cards += showMovies(m));

//             // ubah isi movie container
//             movieContainer.innerHTML = cards;


//             // jika tombol detail diklik
//             const detailBtn = document.querySelectorAll('.modal-detail-button');
//             detailBtn.forEach(btn => {
//                 btn.addEventListener('click', function() {
//                     const imbdid = this.getAttribute('data-imdbid');
//                     // jalankan fetch
//                     fetch('http://www.omdbapi.com/?i=' + imbdid + '&apikey=49cd3c81').then(response => response.json()).then(response => {
//                         // ubah isi modal-body
//                         const modalBody = document.querySelector('.modal-body');
//                         modalBody.innerHTML = showDetailMovie(response);
//                     })
//                 })
//             })
//         });

// })




// fetch (refactor)
const searchbtn = document.querySelector('.search-movie-button');
searchbtn.addEventListener('click', async function() {
    try {
        const searchKeyword = document.querySelector('.keyword-name-movie');
        const movies = await getMovies(searchKeyword.value);
        displayMovies(movies);
    } catch (err) {
        alert(err);
    }
})


// event bandling
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('modal-detail-button')) {
        const imdbid = e.target.dataset.imdbid;
        const detailMovie = await getDetailMovie(imdbid);
        displayDetailMovie(detailMovie);
    }
})


async function getMovies(keyword) {
    return fetch('http://www.omdbapi.com/?s=' + keyword + '&apikey=49cd3c81')
        .then(response => {
            if (response.ok === false) {
                throw new Error(response.statusText);
            }
            return response.json();

        })
        .then(response => {
            if (response.Response === 'False') {
                throw new Error(response.Error);
            }
            return response.Search;
        });
}


function displayMovies(movies) {
    let cards = '';
    return movies.forEach(m => {
        cards += showMovies(m);
        const movieContainer = document.querySelector('.movie-container');
        movieContainer.innerHTML = cards;
    });
}

async function getDetailMovie(id) {
    return fetch('http://www.omdbapi.com/?i=' + id + '&apikey=49cd3c81').then(response => response.json())
        .then(response => response);
}

function displayDetailMovie(m) {
    const modalBody = document.querySelector('.modal-body');
    return modalBody.innerHTML = showDetailMovie(m);
}



function showMovies(m) {
    return `<div class="col-sm-4 my-3">
    <div class="card rounded-3">
        <img src="${m.Poster}" class="card-img-top">
        <div class="card-body bg-dark">
            <h5 class="card-title">${m.Title}</h5>
            <h6 class="card-subtitle mb-2 text-secondary">${m.Year}</h6>
            <a href="#" class="btn btn-secondary modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
        </div>
    </div>
</div>`
}

function showDetailMovie(m) {
    return `<div class="container-fluid">
    <div class="row">
        <div class="col-md-3">
            <img src="${m.Poster}" class="img-fluid">
        </div>
        <div class="col-md">
            <ul class="list-group">
                <li class="list-group-item bg-dark text-light"><h4>${m.Title} (${m.Year})</h4></li>
                <li class="list-group-item bg-dark text-light"><strong>Directtor: </strong>${m.Director}</li>
                <li class="list-group-item bg-dark text-light"><strong>Actors: </strong>${m.Actors}</li>
                <li class="list-group-item bg-dark text-light"><strong>Plot: </strong><br>${m.Plot}</li>
            </ul>
        </div>
    </div>
</div>`;
}