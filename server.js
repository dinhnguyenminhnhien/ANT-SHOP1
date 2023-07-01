const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId;
const PORT = process.env.PORT || 8080;

const app = express();

// This tells Express we’re using EJS as the template engine.
app.set('view engine', 'ejs')

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))

const connectionString = 'mongodb+srv://minhnhien:123Bon@atlascluster.neah9ie.mongodb.net/'

// server -> connect -> MongoDB
MongoClient.connect(connectionString, (err, client) => {

    if (err) return console.error(err)

    console.log('Connected to Database')

    // server -> create -> database -> 'star-wars-quotes' 
    const db = client.db('star-wars-quotes')

    // server -> create -> collection -> 'quotes'
    const quotesCollection = db.collection('quotes')

    app.post('/AddProduct', (req, res) => {
        quotesCollection.insertOne(req.body)
        .then(rs => {
            res.redirect('back')
        })
        .catch(err => {
            console.error(err)
            return res.redirect('back')
        })
    })

    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
        .then(rs => {
            res.render('index', {quotes: rs})
        })
        .catch(err => console.error(err))
    })

    app.get('/RemoveProduct/:id', (req, res) => {
        db.collection('quotes').deleteOne({_id: ObjectId(req.params.id)})
        .then(results => {
            res.redirect('back');
        })
        .catch(error => console.error(error))
        
    })

    app.listen(PORT, function() {
        console.log('listening on http://localhost:' + PORT)
    })

})
