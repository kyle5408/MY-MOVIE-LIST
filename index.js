const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12


const movies = []
let filterMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#pagination')

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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`

  })

  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / (MOVIES_PER_PAGE))
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page = "${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function onPaginatiorClick(event) {
  // 如果不是點到<a></a>(超連結)就不執行
  // tagName會返回大寫
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPages(page))
})




// page　→ 顯示該page的資料
function getMoviesByPages(page) {
  // 若filterMovies非空陣列，給filterMovies，否則給movies
  const data = filterMovies.length ? filterMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    alert('電影已經在收藏清單中')
    return
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filterMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filterMovies.length === 0) {
    return alert(`Cannot find movies with keyword: ${keyword}`)
  }

  renderPaginator(filterMovies.length)
  // renderMovieList(filterMovies)
  renderMovieList(getMoviesByPages(1))
})


axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPages(1))
  })
  .catch((err) => console.log(err))
