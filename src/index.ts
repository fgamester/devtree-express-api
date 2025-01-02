import server from './server'

const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log('SERVER IS RUNNING AT PORT:', port) 
})