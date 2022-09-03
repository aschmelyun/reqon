#!/usr/bin/env node
import chalk from 'chalk'
import figlet from 'figlet'
import express from 'express'
import minimist from 'minimist'
import { join } from 'path'
import { Low, JSONFile } from 'lowdb'
import { homedir } from 'os'
import { existsSync, mkdirSync } from 'fs'
import listenerHandler from '../lib/routes/listener.js'

global.args = minimist(process.argv.slice(2))
global.__reqon = join(homedir(), '.reqon')
if (!existsSync(__reqon)) {
    mkdirSync(__reqon)
}

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

// set the default maximum entries saved in the database as 100
if (!args.hasOwnProperty('save-max')) {
    args['save-max'] = 100
}

// set the default file used in lowdb to ~/.reqon/db.json
if (!args.hasOwnProperty('save-file')) {
    args['save-file'] = join(__reqon, 'db.json')
}

if (args.save !== false) {
    const adapter = new JSONFile(args['save-file'])
    global.db = new Low(adapter)
}

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

    if (typeof db !== 'undefined') {
        await db.read()
        db.data ||= { entries: [] }
    }

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

    if (args.dashboard !== false) {
        dashboard.listen(args.dashboardPort, () => {
            console.log(chalk.white('View requests in the dashboard'))
            console.log(chalk.cyan.bold.underline(`http://localhost:${args['dashboard-port']}`))
        })
    }
})