#!/usr/bin/env node
import chalk from 'chalk'
import express from 'express'
import minimist from 'minimist'
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { homedir } from 'os'
import { existsSync, mkdirSync } from 'fs'
import listenerHandler from '../lib/routes/listener.js'
import { fileURLToPath } from 'url'
import prettyMs from 'pretty-ms'

process.stdout.write(
    String.fromCharCode(27) + "]0;" + "reqon - listening" + String.fromCharCode(7)
)

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

console.clear()
console.log('')
console.log(chalk.cyan.bold("┏━┓ ┏━━┓ ┏━━┓ ┏━━┓ ┏━┓ "))
console.log(chalk.cyan.bold("┃┏┛ ┃┃━┫ ┃┏┓┃ ┃┏┓┃ ┃┏┓┓"))
console.log(chalk.cyan.bold("┃┃  ┃┃━┫ ┃┗┛┃ ┃┗┛┃ ┃┃┃┃"))
console.log(chalk.cyan.bold("┗┛  ┗━━┛ ┗━┓┃ ┗━━┛ ┗┛┗┛"))
console.log(chalk.cyan.bold("           ┗┛          "))
console.log('')

if (typeof db !== 'undefined') {
    await db.read()
    db.data ||= { entries: [] }
}

listener.use(express.json())
listener.use(express.urlencoded({ extended: true })) 

listener.all('/*', listenerHandler)

dashboard.set('view engine', 'ejs')
dashboard.set('views', join(dirname(fileURLToPath(import.meta.url)), '../lib/views'))
dashboard.get('/', (req, res) => {
    res.render('dashboard', {
        prettyMs: prettyMs,
        entries: db.data.entries.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
    })
})

listener.listen(args.port, () => {
    console.log(chalk.white('Listening for new requests'))
    console.log(chalk.cyan.bold.underline(`http://localhost:${args['port']}`))
    console.log('')
})

if (args.dashboard !== false) {
    dashboard.listen(args['dashboard-port'], () => {
        console.log(chalk.white('View requests in the dashboard'))
        console.log(chalk.cyan.bold.underline(`http://localhost:${args['dashboard-port']}`))
        console.log('')
    })
}