//modules
require('babel-register')
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const morgan = require('morgan')('dev')
const twig = require('twig')
const { response } = require('express')

//Variable globales
const app = express()
const port = 3000

const fetch = axios.create({
    baseURL: 'http://localhost:8081/api/v1'
});

// Middlewares
app.use(morgan)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// page d'acceueil
app.get('/', (req, res) => {
    res.redirect('/members')
})


// Recuperation de tous les membres
app.get('/members', (req, res) => {
    apiCall(req.query.max ? `/membres?max= ${req.query.max}` : '/membres', 'get', {},  res, (result) => {
        res.render('members.twig', {
            members: result
        })
    })
})

// recuperation d'un seul membre

app.get('/members/:id', (req, res) => {
    apiCall('/membres/' + req.params.id,'get', {}, res, (result) => {
        res.render('member.twig', {
            member: result
        })
    })

})

// page gerant la modification d'un membree
app.get('/edit/:id',(req, res) => {
    apiCall('/membres/' + req.params.id,'get', {}, res, (result) => {
        res.render('edit.twig', {
            member: result
        })
    })
})

//methode permetant de modifier un membre
app.post('/edit/:id',(req, res) => {
    apiCall('/membres/' + req.params.id,'put', {name : req.body.name }, res, () => {
        res.redirect('/members')
    })
})

// methode permetant de supprimer un membre
app.post('/delete' , (req , res) => {
    apiCall('/membres/' + req.body.id, 'delete', {} ,res, () => {
        res.redirect('/members')
    })
})

//page gerant l'ajout d'un membre
app.get('/insert' , (req , res) => {
    res.render('insert.twig')
})

// methode permetant d'inserer un membre
app.post('/insert' , (req , res) => {
    apiCall('/membres', 'post', {name : req.body.name} ,res, () => {
        res.redirect('/members')
    })
})

// lancement de l'application
app.listen(port, () => console.log(`started on port ${port}`))

// functions

function renderError(res, err) {
    res.render('error.twig', {
        errorMsg: err
    })
}

function apiCall(url, method, data, res, next) {
    fetch({
        method : method,
        url : url,
        data : data
    })
    .then((response) => {
            if (response.data.status == 'success') {
                next(response.data.result)
            }
            else {
                renderError(res, response.data.message)
            }
        })
        .catch((err) => renderError(res, err.message))
}

