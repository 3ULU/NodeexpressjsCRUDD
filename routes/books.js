var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

// display books page with pagination
router.get('/', function (req, res, next) {
    const page = parseInt(req.query.page) || 1; // Página actual (por defecto, 1)
    const limit = 5; // Número de elementos por página
    const offset = (page - 1) * limit; // Calcular el desplazamiento

    // Consulta para obtener los libros de la página actual
    dbConn.query('SELECT * FROM books LIMIT ? OFFSET ?', [limit, offset], function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('books/index', { data: '', currentPage: page, totalPages: 1 });
        } else {
            // Consulta para contar el total de libros
            dbConn.query('SELECT COUNT(*) AS total FROM books', function (err, countResult) {
                if (err) {
                    req.flash('error', err);
                    res.render('books/index', { data: '', currentPage: page, totalPages: 1 });
                } else {
                    const totalBooks = countResult[0].total; // Total de libros
                    const totalPages = Math.ceil(totalBooks / limit); // Total de páginas

                    // Renderizar la vista con los datos
                    res.render('books/index', {
                        data: rows, // Libros de la página actual
                        currentPage: page, // Página actual
                        totalPages: totalPages, // Total de páginas
                    });
                }
            });
        }
    });
});

// display add book page
router.get('/add', function (req, res, next) {
    // render to add.ejs
    res.render('books/add', {
        name: '',
        author: ''
    });
});

// add a new book
router.post('/add', function (req, res, next) {
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('books/add', {
            name: name,
            author: author
        });
    }

    // if no error
    if (!errors) {
        var form_data = {
            name: name,
            author: author
        };

        // insert query
        dbConn.query('INSERT INTO books SET ?', form_data, function (err, result) {
            if (err) {
                req.flash('error', err);

                // render to add.ejs
                res.render('books/add', {
                    name: form_data.name,
                    author: form_data.author
                });
            } else {
                req.flash('success', 'Book successfully added');
                res.redirect('/books');
            }
        });
    }
});

// display edit book page
router.get('/edit/(:id)', function (req, res, next) {
    let id = req.params.id;

    dbConn.query('SELECT * FROM books WHERE id = ' + id, function (err, rows, fields) {
        if (err) throw err;

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id);
            res.redirect('/books');
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('books/edit', {
                title: 'Edit Book',
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author
            });
        }
    });
});

// update book data
router.post('/update/:id', function (req, res, next) {
    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('books/edit', {
            id: req.params.id,
            name: name,
            author: author
        });
    }

    // if no error
    if (!errors) {
        var form_data = {
            name: name,
            author: author
        };
        // update query
        dbConn.query('UPDATE books SET ? WHERE id = ' + id, form_data, function (err, result) {
            if (err) {
                // set flash message
                req.flash('error', err);
                // render to edit.ejs
                res.render('books/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                });
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/books');
            }
        });
    }
});

// delete book
router.get('/delete/(:id)', function (req, res, next) {
    let id = req.params.id;

    dbConn.query('DELETE FROM books WHERE id = ' + id, function (err, result) {
        if (err) {
            // set flash message
            req.flash('error', err);
            // redirect to books page
            res.redirect('/books');
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id);
            // redirect to books page
            res.redirect('/books');
        }
    });
});

module.exports = router;