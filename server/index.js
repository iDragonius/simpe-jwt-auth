require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router  = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')
const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(errorMiddleware)




async function start() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => console.log('connected'))
        app.listen(PORT, () => console.log(`server listened on ${PORT}`))
    } catch (error) {
        console.error(error)
    }
}

start()

