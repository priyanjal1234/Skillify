import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'
import db from './db/index.js'
import { port } from './constants.js'

db()
.then(function() {
    app.listen(port,function() {
        console.log(`Server is running on port ${port}`)
    })
})
.catch(function(err) {
    console.log(`Database Connection Failed: ${err instanceof Error ? err.message : err}`)
})
