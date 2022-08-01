'use strict'
const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 3

var gTitle = ['Harry Potter', 'Wheel of Time', 'LOTR', 'History of mankind', 'Project X', 'Something', 'Dictionary']
var gBooks
var gId
var gRate = 0
var gPageIdx = 0
var gFilterBy = { maxPrice: 100, minRate: 0, title: '' }
_createBooks()
// console.log('gBooks:', gBooks)


function getBooksForDisplay() {

    if (gFilterBy.title !== '') var books = gBooks.filter(book => book.title.includes(gFilterBy.title))
    else {
        books = gBooks.filter(book => book.price <= gFilterBy.maxPrice &&
            book.rate >= gFilterBy.minRate)
    }
    gFilterBy.title = ''
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}


function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(name, price) {

    const book = _createBook(name, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    gId = book.id
    return book
}


function updateBook(bookId, bookPrice) {
    const book = gBooks.find(book => bookId === book.id)
    book.price = bookPrice
    _saveBooksToStorage()
}

function getBookRate(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    book.rate = gRate
    _saveBooksToStorage()
}

function setBookSort(sortBy) {
    // console.log('sortBy:', sortBy)
    const sort = sortBy.innerText.toLowerCase()
    if (sort === '') return
    if (sort === 'title') gBooks.sort((b1, b2) => b1.title.localeCompare(b2.title))
    else gBooks.sort((b1, b2) => (b1[sort] - b2[sort]))
    console.log('gFilterBy:', gFilterBy)
    console.log('gBooks:', gBooks)
}

function setBooksFilter(filterBy = {}) {
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title

    return gFilterBy
}

function nextPage() {
// console.log('gBooks.length:', gBooks.length)
    if (!((gPageIdx+1) * PAGE_SIZE > gBooks.length)) {
        gPageIdx++
        console.log('gPageIdx:', gPageIdx)
        return
    }
}

function prevPage() {
    if (!gPageIdx <= 0) {
        gPageIdx--
        console.log('gPageIdx:', gPageIdx)
    }
}


function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        for (var i = 0; i < gTitle.length; i++) {
            books.push(_createBook(gTitle[i]))
        }
    }
    gBooks = books
    _saveBooksToStorage()
    return gBooks
}


function _createBook(title, price) {
    return {
        id: makeId(),
        title,
        price: price || getRandomIntInclusive(30, 100),
        rate: 0
    }
}


function _saveBooksToStorage() {

    saveToStorage(STORAGE_KEY, gBooks)
}