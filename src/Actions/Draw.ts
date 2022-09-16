import chalk from 'chalk'

export default class Draw {
    static title(): void {
        console.clear()
        console.log('')
        console.log(chalk.cyan.bold("┏━┓ ┏━━┓ ┏━━┓ ┏━━┓ ┏━┓ "))
        console.log(chalk.cyan.bold("┃┏┛ ┃┃━┫ ┃┏┓┃ ┃┏┓┃ ┃┏┓┓"))
        console.log(chalk.cyan.bold("┃┃  ┃┃━┫ ┃┗┛┃ ┃┗┛┃ ┃┃┃┃"))
        console.log(chalk.cyan.bold("┗┛  ┗━━┛ ┗━┓┃ ┗━━┛ ┗┛┗┛"))
        console.log(chalk.cyan.bold("           ┗┛          "))
        console.log('')
    }
    static help(): void {
        console.log(chalk.cyan.bold("Description: ") + chalk.white("effortlessly intercept and inspect http requests."))
        console.log("")
        console.log(chalk.cyan.bold("Usage: ") + chalk.white("reqon ") + chalk.gray("[options]"))
        console.log("")
        console.log(chalk.cyan.bold("Options: "))
        console.log(chalk.white("  --port=<port>") + "               " + chalk.gray("sets the port to listen for incoming requests"))
        console.log(chalk.white("  --dashboard-port=<port>") + "     " + chalk.gray("sets the port the dashboard is available on"))
        console.log(chalk.white("  --save-max=<number>") + "         " + chalk.gray("changes the max number of entries saved locally"))
        console.log(chalk.white("  --save-file=<path>") + "          " + chalk.gray("changes the filepath used for local db, json ext required"))
        console.log(chalk.white("  --no-dashboard") + "              " + chalk.gray("disables the dashboard, --dashboard-port is ignored"))
        console.log(chalk.white("  --no-save") + "                   " + chalk.gray("disables saving locally, --save-file + --save-max ignored"))
        console.log(chalk.white("  --help") + "                      " + chalk.gray("what you're seeing right now :)"))
        console.log("")
    }
}