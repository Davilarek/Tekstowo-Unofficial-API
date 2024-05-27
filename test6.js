const TekstowoAPI = require("./index");
const TekstowoAPIInstance = new TekstowoAPI(fetch, 0);
(async () => {
    const artistProfileData = await TekstowoAPIInstance.getArtistProfile("metallica");
    console.log(artistProfileData);
    console.log(await TekstowoAPIInstance.requestComments(artistProfileData.internalId, 0, 'A'));
})();
