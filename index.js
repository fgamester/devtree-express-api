import express from 'express'

const app = express()

//routing
app.get('/', (request, response) => {
    response.send('Hello World')
})

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log('server is running...')
})