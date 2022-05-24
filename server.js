import express from 'express'

const app = express()
const port = process.env.PORT || 3333

app.use(express.static('public'))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/week/:weekNum', (req, res) => {
    res.render('rooster', { weekNum: req.params.weekNum })
})

app.post('/kies-week', (req, res) => {
    res.redirect(`/week/${req.body.week}`)
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
