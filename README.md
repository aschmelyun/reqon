![Screenshot of reqon running in a terminal window](/art/og_image.png)

# Reqon

[![MIT Licensed](https://img.shields.io/github/license/aschmelyun/reqon)](LICENSE.md)
[![Node 16.0.0 or higher](https://img.shields.io/node/v/reqon)](https://npmjs.com/package/reqon)
[![Total Downloads](https://img.shields.io/npm/dt/reqon)](https://npmjs.com/package/reqon)

> Effortlessly intercept and inspect http requests. :satellite:

Reqon is a streamlined cli tool designed to run locally and capture any http requests sent to it. Perfect for determining incoming webhook payloads or testing outgoing local requests before they hit production or third-party applications. Simply swap your endpoint url with the reqon domain, and fire away! 

Captured request details are displayed in the terminal and stored in a local JSON file powered by [LowDB](https://github.com/typicode/lowdb). You can open up the dashboard to see current and past saved requests in a simplistic but effective layout.

## Installation

Installation is through npm and requires node version >= 16.0.0.

```bash
npm install -g reqon
```

## Usage

Reqon's detailed usage is shown below.

```
reqon [options]

options:
  --port=<port>               sets the port to listen for incoming requests
  --dashboard-port=<port>     sets the port the dashboard is available on
  --save-max=<number>         changes the max number of entries saved locally
  --save-file=<path>          changes the filepath used for local db, json ext required
  --no-dashboard              disables the dashboard, --dashboard-port is ignored
  --no-save                   disables saving locally, --save-file + --save-max ignored
  --help                      what you're seeing right now :)
```

There are defaults associated with some of the options above:

- **port** default is `8080`
- **dashboard-port** default is `8081`
- **save-max** default is `50`
- **save-file** default is `~/.reqon/db.json`

> Tip: You can use a tunnelling app like [ngrok](https://ngrok.com) to expose reqon's interceptor outside your local network.

## Contact

Have an issue? [Submit it here!](https://github.com/aschmelyun/reqon/issues/new) Want to get in touch or recommend a feature? Feel free to reach out to me on [Twitter](https://twitter.com/aschmelyun) for any other questions or comments.

## License

This software is licensed under The MIT License (MIT). See [LICENSE.md](LICENSE.md) for more details.