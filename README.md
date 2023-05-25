# Tekstowo Unofficial API
Unofficial API for https://tekstowo.pl<br>
This API has been designed for both Node.JS and Browserside JS.

## Currently supported:
- Getting the lyrics
- Search
## Not planned:
- Account management

## Installing
Note: this project uses [pnpm](https://pnpm.io/) and you should use it too. <br>
However, you don't need to use pnpm if you don't want to (instead of `pnpm install` etc use `npm install`).
1. Download or clone the repo
2. `cd` to the repo
3. `index.js` is the main API file. You can require it in your project etc.
### Browser only steps
If you want to use the browser version, run:
1. `pnpm install`
2. `pnpm run build`
3. Use `TekstowoAPI-browser.js` from `dist/` directory.
4. Use `require("TekstowoAPI")`

## Example usage
In [test.js](./test.js)
### Browser only example
```js
window.TekstowoAPI = new (require("TekstowoAPI"))(1); // 1 for allorigins proxy
await TekstowoAPI.getLyrics("HammerFall", "Last Man Standing");
```

## Please use the API responsibly
Please ensure that you use this API responsibly and for legitimate purposes only. Do not spam the Tekstowo server.

## Disclaimer
Please note that this unofficial API is not officially supported by Tekstowo. Use this API at your own risk.
