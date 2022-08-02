'use strict'

console.log('hi');

function onInit() {
    doTrans()
    renderBooks()
    renderPageBtns()
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
        <td><button data-trans="read" class="read-book" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="onReadBook('${book.id}')">Read</button></td>
        <td><button data-trans="update" class="update-book" onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td><button data-trans="remove" class="remove-book" onclick="onRemoveBook('${book.id}')">Remove</button></td>
     </tr>`
    ).join('')
    document.querySelector('.books-table tbody').innerHTML = strHtml
    // console.log('im render');
    if (gPageIdx === 0) {
        document.querySelector('.prev-page').setAttribute('disabled', '')
    }
}


function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onAddBook(ev) {
    ev.preventDefault()
    var bookTitle = document.querySelector('#bookName').value
    var bookPrice = document.querySelector('#bookPrice').value
    console.log('bookTitle:', bookPrice)
    // const name = prompt(`Book's name?`)
    // if (name) {
    //     var price = +prompt(`Book's price?`, getRandomIntInclusive(30, 100))
    addBook(bookTitle, bookPrice)
    document.querySelector('#bookName').value = ''
    document.querySelector('#bookPrice').value = ''
    renderBooks()
    // }
}

function onUpdateBook(bookId) {
    const bookPrice = +prompt('What is the new price?')
    if (bookPrice) {
        updateBook(bookId, bookPrice)
        renderBooks()
    }
}

function onReadBook(bookId) {
    console.log('bookId:', bookId)
    const book = getBookById(bookId)
    const elModal = document.querySelector('.my-modal')
    console.log('elModal:', elModal)
    elModal.querySelector('h3 .modal-title').innerText = book.title
    elModal.querySelector('h4 .modal-price').innerText = `${book.price}$`
    elModal.querySelector('p').innerText = makeLorem()
    elModal.querySelector('.rate .modal-rate').innerText = ` ${book.rate} `
    gRate = +elModal.querySelector('.rate .modal-rate').innerText
    // elModal.classList.add('open')
    console.log('book.id:', book.id)
    console.log('book.rate:', book.rate)
}

function onCloseModal() {
    const book = getBookById(gId)
    getBookRate(book.id)
    // const elModal = document.querySelector('.modal')
    // elModal.classList.remove('open')
}

function onRateDown() {
    const book = getBookById(gId)
    const elRate = document.querySelector('.modal-footer .rate .modal-rate')
    if (gRate > 0) {
        console.log('gRate', gRate)
        gRate -= 1
        console.log('book.rate:', book.rate)
        elRate.innerText = `  ${gRate}  `
        // console.log('rate:', rate)
    }
    return gRate
}

function onRateUp() {
    const book = getBookById(gId)
    const elRate = document.querySelector('.modal-footer .rate .modal-rate')
    console.log('elRate.innerText:', elRate.innerText)
    console.log('book.rate:', book.rate)
    if (gRate < 10) {
        gRate += 1
        elRate.innerText = `  ${gRate}  `
    }
    console.log('gRate', gRate)
    return gRate
}

function onSetSortBy(sortBy) {
    // console.log('sortBy:', sortBy)
    console.log('sortBy:', sortBy.innerText)
    setBookSort(sortBy)
    renderBooks()

}

function onSetFilterBy(filterBy) {
    filterBy = setBooksFilter(filterBy)
    renderBooks()

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}&title=${filterBy.title}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

// function onSearchAdd(ev) {
//     ev.preventDefault()
//     const elTxt = document.querySelector('[name=book-search]')
//     if (elTxt.value === '') return
//     else {
//         var filterBy = { title: elTxt.value }
//         setBooksFilter(filterBy)
//         renderBooks()
//         // console.log('filterBy:', filterBy)
//         elTxt.value = ''
//     }
//     const queryStringParams = `?title=${filterBy.title}`
//     const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
//     window.history.pushState({ path: newUrl }, '', newUrl)
// }

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
    var pageIdx = gPageIdx + 1
    if (PAGE_SIZE * pageIdx >= gBooks.length) {
        document.querySelector('.next-page').setAttribute('disabled', '')
    } else {
        document.querySelector('.next-page').removeAttribute('disabled')
        document.querySelector('.prev-page').removeAttribute('disabled')
    }
    renderBooks()
}

function onPrevPage() {
    prevPage()
    if (gPageIdx > 0) {
        document.querySelector('.prev-page').removeAttribute('disabled')
        document.querySelector('.next-page').removeAttribute('disabled')
    }
    renderBooks()
}

function onSetLang(lang) {
    setLang(lang)
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    doTrans()
    renderBooks()
}

function renderPageBtns() {

    const btnsNums = gBooks.length / PAGE_SIZE
    const elPageNum = document.querySelector('.pageBtn')
    console.log('elPageNum:', elPageNum)
    var strHtml = ''
    for (var i = 1; i <= btnsNums; i++) {
        strHtml += `<button type="button" class="btn btn-light curr-page"  onclick=onGoTopage(this)>${i}</button>`
    }
    // console.log('strHtml:', strHtml)

    elPageNum.innerHTML = strHtml
}

function onGoTopage(pageNum) {
    
    if (PAGE_SIZE * pageNum.innerText >= gBooks.length) {
        document.querySelector('.next-page').setAttribute('disabled', '')
    } else {
        document.querySelector('.next-page').removeAttribute('disabled')
        document.querySelector('.prev-page').removeAttribute('disabled')
    }
    if (gPageIdx === 0) {
        document.querySelector('.prev-page').removeAttribute('disabled')
        document.querySelector('.next-page').removeAttribute('disabled')
    }
    goToPage(pageNum)
    renderBooks()
}