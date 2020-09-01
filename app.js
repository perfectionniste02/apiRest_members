require('babel-register')
const mysql = require('promise-mysql')
const express = require('express')
//const expressOasGenerator = require('express-oas-generator');
const morgan = require('morgan')
const { query } = require('express')
const { success, error , checkAndChange } = require('./assets/fonctions')
const bodyParser = require('body-parser')
const config = require('./assets/config')

const app = express()
//expressOasGenerator.init(app, {});



app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
}).then((db) => {
    console.log('connected at database')
    let Members = require('./assets/classes/members-class')(db, config)


    let MembersRouter = express.Router()


    MembersRouter.route('/:id')

        // Recupere un membre avec son ID
        .get(async (req, res) => {

            let member = await Members.getByID(req.params.id)
            res.json(checkAndChange(member))
        })

        // Modifier un membre avec son ID
        .put(async(req, res) => {

            let updateMember = await Members.update(req.params.id, req.body.name)
            res.json(checkAndChange(updateMember))
        })
        // Suprimer un membre avec son ID
        .delete(async (req, res) => {
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))
        })

    MembersRouter.route('/')

        // Recupere tous les membres
        .get( async (req, res) => {
            let allMembers = await Members.getAll(req.query.max)
            res.json(checkAndChange(allMembers))
        })

        // ajouter un membres avec son nom
        .post( async(req, res) => {

            let addMember = await Members.add(req.body.name)
            res.json(checkAndChange(addMember))
        })

    app.use(`${config.rootAPI}membres`, MembersRouter)
    app.listen(config.port, () => { console.log(`connecté sur le port ${config.port}`) })

}).catch((err) => {
    console.log(error(err.message))
    console.log(error('Error during database connection'))
})







