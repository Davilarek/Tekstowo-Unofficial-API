const TekstowoAPI = require("./index");
const TekstowoAPIInstance = new TekstowoAPI(fetch, 0);
(async () => {
    const lyricsExtracted = await TekstowoAPIInstance.extractLyrics(`frontside,dopoki_moje_serce_bije`);
    console.log(lyricsExtracted);
    console.log(await TekstowoAPIInstance.searchLyrics("FrontSide", "Dopóki serce bije"));
    console.log(await TekstowoAPIInstance.searchLyrics("", "Afterlife"));
    console.log(await TekstowoAPIInstance.getPagesForSong("", "Afterlife"));
    console.log(await TekstowoAPIInstance.getPagesForSong("FrontSide", "Dopóki serce bije"));
    console.log(await TekstowoAPIInstance.getLyrics("FrontSide", "Dopóki serce bije"));
    console.log(await TekstowoAPIInstance.extractLyrics(`frontside,dopoki_moje_serce_bijea`));
    console.log(await TekstowoAPIInstance.searchLyrics("", "1234566777"));
})();
