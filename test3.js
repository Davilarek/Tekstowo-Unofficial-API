const TekstowoAPI = require("./index");
const TekstowoAPIInstance = new TekstowoAPI(fetch, 0);
(async () => {
    console.log(await TekstowoAPIInstance.getPagesForSong("Frontside", ""));
    console.log(await TekstowoAPIInstance.getPagesForSong("Foo", ""));
    console.log(await TekstowoAPIInstance.getPagesForSong("Coma", ""));
})();
