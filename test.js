/* eslint-disable no-inline-comments */
const TekstowoAPI = require("./index");
const TekstowoAPIInstance = new TekstowoAPI(fetch, 0);
(async () => {
    const lyricsExtracted = await TekstowoAPIInstance.extractLyrics(`frontside,dopoki_moje_serce_bije`); // ok
    console.log(lyricsExtracted);
    console.log(await TekstowoAPIInstance.searchLyrics("FrontSide", "Dopóki serce bije")); // ok
    console.log(await TekstowoAPIInstance.searchLyrics("", "Afterlife")); // ok
    console.log(await TekstowoAPIInstance.getPagesForSong("", "Afterlife")); // ok
    console.log(await TekstowoAPIInstance.getPagesForSong("FrontSide", "Dopóki serce bije")); // ok
    console.log(await TekstowoAPIInstance.getLyrics("FrontSide", "Dopóki serce bije")); // ok
    console.log(await TekstowoAPIInstance.extractLyrics(`frontside,dopoki_moje_serce_bijea`)); // not ok on purpose; typo
    console.log(await TekstowoAPIInstance.searchLyrics("", "1234566777")); // not ok on purpose; no lyrics with that title
    console.log(await TekstowoAPIInstance.getLyrics("", "Dopóki serce bije")); // not ok; selects wrong because no artist specified and algorithm selects the closest string
    console.log(await TekstowoAPIInstance.getLyrics("", "Dopóki moje serce bije")); // ok
    console.log(await TekstowoAPIInstance.getLyrics("", "Afterlife")); // not ok; selects wrong because no artist specified and algorithm selects the closest string
    console.log(await TekstowoAPIInstance.getMetadata("linkin_park,lost")); // ok
    console.log(await TekstowoAPIInstance.getMetadata("frontside,wspomnienia_jak_relikwie")); // ok
    console.log(await TekstowoAPIInstance.extractLyrics("frontside,wspomnienia_jak_relikwie", true)); // ok
    console.log(await TekstowoAPIInstance.getMetadata("ed_sheeran,shape_of_you_")); // ok
    console.log(await TekstowoAPIInstance.getMetadata("finger_eleven,paralyzer")); // ok
})();
