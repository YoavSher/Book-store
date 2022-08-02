'use strict'

const gTrans = {
    title: {
        en: 'Book Shop',
        he: 'חנות ספרים'
    },
    filter: {
        en: 'Filter',
        he: 'סנן'
    },
    'add-bookName': {
        en: 'Add book name',
        he: 'הוסף שם ספר'
    },
    'add-bookPrice': {
        en: 'Add book price',
        he: 'הוסף מחיר לספר'
    },
    'book-search': {
        en: 'Search',
        he: 'חפש'
    },
    'max-price': {
        en: 'Max price',
        he: 'מחיר מקסימלי'
    },
    'min-rate': {
        en: 'Min rate',
        he: 'דירוג מינימלי'
    },
    // 'prev-pg': {
    //     en: 'Previous page',
    //     he: 'הדף הקודם'
    // },
    // 'next-pg': {
    //     en: 'Next page',
    //     he: 'הדף הבא'
    // },
    'book-title': {
        en: 'Title:',
        he: 'שם הספר:'
    },
    'book-price': {
        en: 'Price',
        he: 'מחיר:'
    },
    'book-sum': {
        en: 'Summery:',
        he: 'תקציר:'
    },
    'book-rate': {
        en: 'Please rate the book from 1-10',
        he: 'דרג את הספר מ1 עד10'
    },
    actions: {
        en: 'Actions',
        he: 'פעולות'
    },
    read: {
        en: 'Read',
        he: 'פרטים'
    },
    update: {
        en: 'Update',
        he: 'עדכן'
    },
    remove: {
        en: 'Remove',
        he: 'הסר'
    }
}

var gLang = 'en'

function setLang(lang) {
    gLang = lang
}

function getTrans(transKey) {
    const key = gTrans[transKey]
    // console.log('key:', key)
    if (!key) return 'UNKNOWN'
    var transVal = key[gLang]
    transVal = !transVal ? key['en'] : key[gLang]
    return transVal
}

function doTrans() {
    const elDataTrans = document.querySelectorAll('[data-trans]')
    // console.log('elDataTrans:', elDataTrans)
    elDataTrans.forEach(dataTrans => {
        const translateKey = dataTrans.dataset.trans
        const translateVal = getTrans(translateKey)
        // console.log('dataTrans:', dataTrans)
        dataTrans.innerText = translateVal
        if (dataTrans.placeholder !== undefined) dataTrans.placeholder = translateVal
    })
}