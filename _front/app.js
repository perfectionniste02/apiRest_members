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
const port = 8080

const fetch = axios.create({
    baseURL: 'http://localhost:8081/api/v1',
  });

// Middlewares
app.use(morgan)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// page D'acceueil
app.get('/' , (req , res) => {
    res.render('index.twig' , {
        name : req.params.name
    })
})


// Recuperation de tous les membres
app.get('/members',(req , res) => {
    fetch.get("/membres")
        .then((response) => {
            if (response.data.status == 'success') 
            {
                res.render('members.twig' , {
                    members : response.data.result
                })
            }
            else{renderError(res, response.data.message)}
        })
        .catch((err) => renderError(res, err.message))
})

// recuperation d'un seul membre

app.get('/members/:id', (req , res) => {
    fetch.app(`/members/${req.params.name}`)
    .then((response) => {
        if (response.data.status == 'success') 
            {
                res.render('member.twig' , {
                    members : response.data.result
                })
            }
        else{renderError(res, response.data.message)}
    })
    .catch((err) => renderError(res , err.message))
})

// lancement de l'application
app.listen(port,() => console.log(`started on port ${port}`))

// functions

function renderError(res, err){
    res.render('error.twig',{
        errorMsg: err.message
    })
}