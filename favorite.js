const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies'))



function renderMovieList(data) {
  let rawHTML = ''

  data.forEach(item => {
    // title, image
    rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card" style="width: 18rem;">
          <img
            src="${POSTER_URL}${item.image}"
            class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id="${item.id}">Movie</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>`

  })

  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title")
  const modalImage = document.querySelector("#movie-modal-image")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalDescription = document.querySelector("#movie-modal-description")
  axios
    .get(INDEX_URL + id).then(response => {
      // response.data.results
      const data = response.data.results
      modalTitle.innerText = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster"
                class="img-fluid">`
      modalDate.innerText = "Realease Date: " + data.release_date
      modalDescription.innerText = data.description
    })
}

function removeFromFavorite(id) {
  if (!favoriteMovies) {
    return
  }
  const movieIndex = favoriteMovies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return
  }
  favoriteMovies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies))
  renderMovieList(favoriteMovies)
}


dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(favoriteMovies)