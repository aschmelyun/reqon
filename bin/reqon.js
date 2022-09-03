#!/usr/bin/env node
import chalk from 'chalk'
import figlet from 'figlet'
import express from 'express'
import minimist from 'minimist'
import { join } from 'path'
import { Low, JSONFile } from 'lowdb'
import { homedir } from 'os'
import { existsSync, mkdirSync } from 'fs'

const args = minimist(process.argv.slice(2))
const listener = express()
const dashboard = express()

// set the default port as 8080
if (!args.hasOwnProperty('port')) {
    args['port'] = 8080
}

// set the default dashboard port as 8081
if (!args.hasOwnProperty('dashboard-port')) {
    args['dashboard-port'] = 8081
}

import listenerHandler from '../lib/routes/listener.js'

figlet('reqon', {
    font: 'Speed',
    verticalLayout: 'fitted',
    whitespaceBreak: true
}, async function(err, data) {
    if (err) {
        console.dir(chalk.white.bgRed.bold(err))
        return
    }
    console.clear()
    console.log(chalk.cyan.bold(data))
    console.log('')

    const __dirname = join(homedir(), '.reqon')

    if (!existsSync(__dirname)) {
        mkdirSync(__dirname)
    }

    const file = join(__dirname, 'db.json')
    const adapter = new JSONFile(file)
    global.db = new Low(adapter)

    await db.read()
    db.data ||= { entries: [] }

    listener.use(express.json())
    listener.use(express.urlencoded({ extended: true })) 

    listener.all('/*', listenerHandler)

    dashboard.get('/', (req, res) => {
        res.send('Dashboard!')
    })

    listener.listen(args.port, () => {
        console.log(chalk.white('Listening for new requests'))
        console.log(chalk.cyan.bold.underline(`http://localhost:${args['port']}`))
        console.log('')
    })

    if (!args.hasOwnProperty('disable-dashboard')) {
        dashboard.listen(args.dashboardPort, () => {
            console.log(chalk.white('View requests in the dashboard'))
            console.log(chalk.cyan.bold.underline(`http://localhost:${args['dashboard-port']}`))
        })
    }
})