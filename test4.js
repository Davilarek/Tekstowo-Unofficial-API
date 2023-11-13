const TekstowoAPI = require("./index");
const TekstowoAPIInstance = new TekstowoAPI(fetch, 0);
const SortingConstants = TekstowoAPIInstance.Sorting;
(async () => {
    console.log(await TekstowoAPIInstance.getArtistsSongList("night_mistress", { }));
    console.log(await TekstowoAPIInstance.getArtistsSongList("night_mistress", { sortMode: SortingConstants.SortMode.alphabetically, sortDir: SortingConstants.SortDirection.descending }));
    console.log(await TekstowoAPIInstance.getArtistsSongList("night_mistress", { sortMode: SortingConstants.SortMode.date }));
})();
