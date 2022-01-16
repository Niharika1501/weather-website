const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utilis/geocode')
const forecast = require('./utilis/forecast')
// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))
const app = express()
//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup handlers engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath) 
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath)) // Setup static director to serve

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Niharika Madke'
    })
})

app.get('/about', (req,res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Niharika Madke'
    })
})

app.get('/help', (req,res) => {
    res.render('help',{
        title: 'Help',
        name: 'Niharika Madke'
    })
})
app.get('', (req, res) => {
    res.send('<h1>Weather</h1>')
})

// app.get('/help', (req, res) => {
//     res.send([{
//         name: 'Niharika',
//         age: 20
//     },
//     {
//         name: 'Twinkle',
//         age:17
//     }])
// })

// app.get('/about', (req, res) => {
// res.send('<h1>About Page</h1>')
// })

app.get('/weather', (req, res) => {
    if(!req.query.address)
    {
        return res.send({
            error: 'Provide address term'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error)
        {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error)
            {
                return res.send({ error })
            }
            res.send({
                location,
                forecast: forecastData
            })
        })
    })

    // res.send({
    //     forecast: 'Cold',
    //     location: 'Ahmedabad',
    //     address: req.query.address
    // })
})

app.get('/products', (req,res) => {
    if(!req.query.search) {
       return res.send({
            error: 'Provide search term'
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404',{
        title: '404 page',
        name: 'Niharika Madke',
        errorMessage: 'Help article not found'
    })
})
app.get('*', (req,res) => {
    res.render('404',{
        title: '404 page',
        name: 'Niharika Madke',
        errorMessage: 'Page Not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})