'use strict'

console.log('hi');

function onInit() {
    renderBooks()
    renderFilterByQueryStringParams()
}


function renderBooks() {
    // const books = gBooks
    const books = getBooksForDisplay()
    var strHtml = books.map(book =>
        `<tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.price}$</td>
        <td><button class="read-book" onclick="onReadBook('${book.id}')">Read</button></td>
        <td><button class="update-book" onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td><button class="remove-book" onclick="onRemoveBook('${book.id}')">Remove</button></td>
     </tr>`
    ).join('')
    strHtml = `<tr> <th>ID</th><th onclick="onSetSortBy(this)">TITLE</th><th onclick="onSetSortBy(this)">PRICE</th>
    <th colspan="3">Actions</th></tr>` + strHtml
    document.querySelector('.books-table').innerHTML = strHtml
    // console.log('im render');
    if (gPageIdx === 0) {
        document.querySelector('.prev-page').classList.add('disabled-btn')
    }
}


function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onAddBook(ev) {
    // ev.preventDefault()
    const name = prompt(`Book's name?`)
    if (name) {
        var price = +prompt(`Book's price?`, getRandomIntInclusive(30, 100))
        addBook(name, price)
        renderBooks()
    }
}

function onUpdateBook(bookId) {
    const bookPrice = +prompt('What is the new price?')
    if (bookPrice) {
        updateBook(bookId, bookPrice)
        renderBooks()
    }
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')
    // const elRate = document.querySelector('.rate span')
    // console.log('elModal:', elModal)
    console.log('book:', book.title)
    elModal.querySelector('h3 span').innerText = book.title
    elModal.querySelector('h4 span').innerText = `${book.price}$`
    elModal.querySelector('p').innerText = makeLorem()
    elModal.querySelector('.rate span').innerText = ` ${book.rate} `
    gRate = +elModal.querySelector('.rate span').innerText
    elModal.classList.add('open')
    console.log('book.id:', book.id)
    console.log('book.rate:', book.rate)
}

function onCloseModal() {
    const book = getBookById(gId)
    getBookRate(book.id)
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('open')
}

function onRateDown() {
    const book = getBookById(gId)
    const elRate = document.querySelector('.rate span')
    if (gRate > 0) {
        console.log('gRate', gRate)
        gRate -= 1
        console.log('book.rate:', book.rate)
        elRate.innerText = ` ${gRate} `
        // console.log('rate:', rate)
    }
    return gRate
}

function onRateUp() {
    const book = getBookById(gId)
    const elRate = document.querySelector('.rate span')

    console.log('book.rate:', book.rate)
    if (gRate < 10) {
        gRate += 1
        elRate.innerText = ` ${gRate} `
    }
    console.log('gRate', gRate)
    return gRate
}

function onSetSortBy(sortBy) {
    // console.log('sortBy:', sortBy)

    setBookSort(sortBy)
    renderBooks()

}

function onSetFilterBy(filterBy) {
    filterBy = setBooksFilter(filterBy)
    renderBooks()

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSearchAdd(ev) {
    ev.preventDefault()
    const elTxt = document.querySelector('[name=book-search]')
    if (elTxt.value === '') return
    else {
        var filterBy = { title: elTxt.value }
        setBooksFilter(filterBy)
        renderBooks()
        // console.log('filterBy:', filterBy)
        elTxt.value = ''
    }
    const queryStringParams = `?title=${filterBy.title}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: +queryStringParams.get('maxPrice') || 0,
        minRate: +queryStringParams.get('minRate') || 0,
        title: queryStringParams.get('title') || ''
    }

    if (!filterBy.maxPrice && !filterBy.minRate || !filterBy.title) return
    console.log('filterBy:', filterBy)
    // if (!filterBy.title) return
    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    document.querySelector('[name=book-search]').value = filterBy.title
    setBooksFilter(filterBy)

}

function onNextPage() {
    nextPage()
    if (Math.floor(gBooks.length / PAGE_SIZE) <= gPageIdx) {
        console.log('gPageIdx:', gPageIdx)
        document.querySelector('.next-page').classList.add('disabled-btn')
    } else {
        document.querySelector('.next-page').classList.remove('disabled-btn')
        document.querySelector('.prev-page').classList.remove('disabled-btn')
    }
    renderBooks()
}

function onPrevPage() {
    prevPage()
    if (gPageIdx > 0) {
        document.querySelector('.prev-page').classList.remove('disabled-btn')
        document.querySelector('.next-page').classList.remove('disabled-btn')
    }
    renderBooks()
}

