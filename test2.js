const TekstowoAPI = require("./index");
const TekstowoAPIInstance = new TekstowoAPI(fetch, 0);
(async () => {
    console.log(await TekstowoAPIInstance.search("Coma", "Spadam", { page: 1, onlyArtists: true }));
    console.log(await TekstowoAPIInstance.search("Coma", "Spadam", { page: 1, onlySongs: true }));
    console.log(await TekstowoAPIInstance.search("Coma", "Spadam", { page: 1, includePageCount: true }));
    console.log(await TekstowoAPIInstance.searchLyrics("Coma", "Spadam", 1, true));
    console.log(await TekstowoAPIInstance.search("Coma", "Spadam", { page: 1, onlySongs: true, onlyArtists: true }));
    // console.log(await TekstowoAPIInstance.search("Coma", "Spadam", { page: 2 }));
})();
