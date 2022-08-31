#!/usr/bin/env node
import chalk from 'chalk'
import figlet from 'figlet'
import express from 'express'

const listener = express()
const dashboard = express()

import listenerHandler from '../lib/routes/listener.js'

figlet('reqon', {
    font: 'Speed',
    verticalLayout: 'fitted',
    whitespaceBreak: true
}, function(err, data) {
    if (err) {
        console.dir(chalk.white.bgRed.bold(err))
        return
    }
    console.clear();
    console.log(chalk.cyan.bold(data))
    console.log('')

    listener.use(express.json())
    listener.use(express.urlencoded({ extended: true })) 

    listener.all('/*', listenerHandler)

    dashboard.get('/', (req, res) => {
        res.send('Dashboard!')
    })

    listener.listen(8080, () => {
        console.log(chalk.white('Listening for new requests'))
        console.log(chalk.cyan.bold.underline('http://localhost:8080'))
        console.log('')
    })

    dashboard.listen(8081, () => {
        console.log(chalk.white('View requests in the dashboard'))
        console.log(chalk.cyan.bold.underline('http://localhost:8081'))
    })
})