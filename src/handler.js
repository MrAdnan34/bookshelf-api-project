const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  //   const finished = pageCount === readPage ? true : false
  let finished = false
  if (pageCount === readPage) {
    finished = true
  }
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  if (newBook.name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  const booksArray = []
  books.forEach((book) => {
    const { id, name, publisher } = book
    book = { id, name, publisher }
    booksArray.push(book)
  })

  if (name) {
    const booksNameFiltered = booksArray.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    )

    if (booksNameFiltered.length > 0) {
      const response = h.response({
        status: 'success',
        data: {
          books: booksNameFiltered
        }
      })
      response.code(200)
      return response
    } else {
      const response = h.response({
        status: 'fail',
        message: 'Gagal mencari buku. Query name tidak ada dalam bookshelf'
      })
      response.code(200)
      return response
    }
  }

  if (reading) {
    if (reading === '0') {
      const booksReadingFalseFiltered = books.filter(
        (book) => book.reading === false
      )

      const booksArrayReadingFalse = []
      booksReadingFalseFiltered.forEach((bookFalse) => {
        const { id, name, publisher } = bookFalse
        bookFalse = { id, name, publisher }
        booksArrayReadingFalse.push(bookFalse)
      })

      const response = h.response({
        status: 'success',
        data: {
          books: booksArrayReadingFalse
        }
      })
      response.code(200)
      return response
    } else if (reading === '1') {
      const booksReadingTrueFiltered = books.filter(
        (book) => book.reading === true
      )

      const booksArrayReadingTrue = []
      booksReadingTrueFiltered.forEach((bookTrue) => {
        const { id, name, publisher } = bookTrue
        bookTrue = { id, name, publisher }
        booksArrayReadingTrue.push(bookTrue)
      })

      const response = h.response({
        status: 'success',
        data: {
          books: booksArrayReadingTrue
        }
      })
      response.code(200)
      return response
    } else {
      const response = h.response({
        status: 'success',
        data: {
          books: booksArray
        }
      })
      response.code(200)
      return response
    }
  }

  if (finished) {
    if (finished === '0') {
      const booksFinishedFalseFiltered = books.filter(
        (book) => book.finished === false
      )

      const booksArrayFinishedFalse = []
      booksFinishedFalseFiltered.forEach((bookFalse) => {
        const { id, name, publisher } = bookFalse
        bookFalse = { id, name, publisher }
        booksArrayFinishedFalse.push(bookFalse)
      })

      const response = h.response({
        status: 'success',
        data: {
          books: booksArrayFinishedFalse
        }
      })
      response.code(200)
      return response
    } else if (finished === '1') {
      const booksFinishedTrueFiltered = books.filter(
        (book) => book.finished === true
      )

      const booksArrayFinishedTrue = []
      booksFinishedTrueFiltered.forEach((bookTrue) => {
        const { id, name, publisher } = bookTrue
        bookTrue = { id, name, publisher }
        booksArrayFinishedTrue.push(bookTrue)
      })

      const response = h.response({
        status: 'success',
        data: {
          books: booksArrayFinishedTrue
        }
      })
      response.code(200)
      return response
    } else {
      const response = h.response({
        status: 'success',
        data: {
          books: booksArray
        }
      })
      response.code(200)
      return response
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: booksArray
    }
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  } else {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  }
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const bookIndex = books.findIndex((book) => book.id === bookId)

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } else {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    }
    if (books[bookIndex].name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }

    if (books[bookIndex].readPage > books[bookIndex].pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
}

const deleteNoteByIdHandler = (request, h) => {
  const { bookId } = request.params

  const bookIndex = books.findIndex((book) => book.id === bookId)

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } else {
    books.splice(bookIndex, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteNoteByIdHandler
}
