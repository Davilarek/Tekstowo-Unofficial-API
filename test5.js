const TekstowoAPI = require("./index");
const TekstowoAPIInstance = new TekstowoAPI(fetch, 0);
(async () => {
    const lyricsData = await TekstowoAPIInstance.extractLyrics("arctic_monkeys,do_i_wanna_know");
    console.log(lyricsData);
    console.log(await TekstowoAPIInstance.requestComments(lyricsData.internalId, 0));
})();
