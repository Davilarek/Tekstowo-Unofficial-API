class TekstowoAPIRequestOptions {
	/**
	 * @param {string} url
	 * @param {RequestInit} fetchOptions
	 */
	constructor(url, fetchOptions) {
		this.url = url;
		this.fetchOptions = fetchOptions;
	}
}

/**
 * @enum {number}
 */
const TekstowoAPIProxyMethods = {
	/** @type {number} */
	None: 0,
	/** @type {number} */
	AllOrigins: 1,
	/** @type {number} */
	SirJoshProxy: 2,
};

// eslint-disable-next-line no-unused-vars
class TekstowoAPILyricsID extends String { }

// eslint-disable-next-line no-unused-vars
class TekstowoAPIArtistID extends String { }

class TekstowoAPISearchResults {
	/**
	 * @param {Object.<string, TekstowoAPILyricsID>} songs
	 * @param {Object.<string, TekstowoAPIArtistID>} artists
	 * @param {number} pageCount
	 */
	constructor(songs, artists, pageCount) {
		this.songs = songs;
		this.artists = artists;
		this.pageCount = pageCount;
	}
}

const TekstowoAPIUrls = {
	/**
	 * @param {TekstowoAPILyricsID} id
	 */
	LYRICS: (id) => { return "https://www.tekstowo.pl/piosenka," + id + ".html"; },
	SEARCH: (artist, title, page = 1) => {
		let baseUrl = `https://www.tekstowo.pl/szukaj,`;
		if (!artist)
			artist = "";
		if (!title)
			title = "";
		// if (artist)
		baseUrl += `wykonawca,` + artist + ",";
		// if (title)
		baseUrl += `tytul,` + title + ",";
		baseUrl += "strona," + page;
		return baseUrl + ".html";
	},
};

class TekstowoAPILyrics {
	/**
	 * @param {string} original
	 * @param {string} translated
	 * @param {{}} metadata
	 * @param {string} lyricsName
	 */
	constructor(original, translated, metadata, lyricsName) {
		this.original = original;
		this.translated = translated;
		// eslint-disable-next-line no-inline-comments
		if (metadata) // we don't want "undefined" to be printed out
			this.metadata = metadata;
		// eslint-disable-next-line no-inline-comments
		if (lyricsName) // we don't want "undefined" to be printed out
			this.lyricsName = lyricsName;
	}
}

/**
 * just an Object
 * @typedef TekstowoAPILyricsMetadata
 */

class TekstowoAPI {
	/**
	 * Creates a new TekstowoAPI instance
	 * @param {fetch} FetchImpl
	 * @param {TekstowoAPIProxyMethods} proxyMetod
	 */
	constructor(FetchImpl, proxyMetod = TekstowoAPIProxyMethods.AllOrigins) {
		if (!(typeof FetchImpl === 'function'))
			FetchImpl = fetch;
		/**
		 * @type {fetch}
		 */
		this.FetchImpl = FetchImpl;
		this.proxyMetod = proxyMetod;
	}
	/**
	 * Makes a request using TekstowoAPI#FetchImpl.
	 * @see TekstowoAPI#FetchImpl
	 * @param {TekstowoAPIRequestOptions} options
	 * @returns {Promise<Response>}
	 */
	async makeRequest(options) {
		const localFetch = this.FetchImpl;
		return await localFetch(options.url, options.fetchOptions);
	}
	/**
	 * Selects a proxy using TekstowoAPI#proxyMetod.
	 * @see TekstowoAPI#proxyMetod
	 * @param {string} url
	 * @returns {string}
	 */
	proxyThisUrl(url) {
		switch (this.proxyMetod) {
			/* https://github.com/gnuns/allorigins */
			case TekstowoAPIProxyMethods.AllOrigins:
				return "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
			/* https://github.com/SirJosh3917/cors-get-proxy */
			case TekstowoAPIProxyMethods.SirJoshProxy:
				return "https://cors-get-proxy.sirjosh.workers.dev/?url=" + encodeURIComponent(url);
			default:
				return url;
		}
	}
	/**
	 * Downloads and parses lyrics page for specified arguments.
	 * @param {TekstowoAPILyricsID} songId
	 * @param {boolean} withMetadata
	 * @returns {Promise<TekstowoAPILyrics | null>}
	 */
	async extractLyrics(songId, withMetadata = false) {
		const requestOptions = new TekstowoAPIRequestOptions(
			this.proxyThisUrl(TekstowoAPIUrls.LYRICS(songId)), { method: "GET" },
		);
		const response = await this.makeRequest(requestOptions);
		const responseText = unescapeJsonString(await response.text());
		const fail = responseText.replace(/\n{2,}/g, '\n').split("<title>")[1].split("</title>")[0].includes("404");
		if (fail)
			return null;
		// const lyricsNormal = (responseText.split(`inner-text">`)[1].split("</div>")[0].replace(/<br \/>/g, '\n')).replace(/\r/g, '').replace(/\n{2,}/g, '\n');
		const lyricsNormal = (responseText.split(`inner-text">`)[1].split("</div>")[0].replace(/\n/g, '').replace(/<br \/>/g, '\n')).replace(/\r/g, '');
		// const lyricsTranslated = (responseText.split(`inner-text">`)[2].split("</div>")[0].replace(/<br \/>/g, '\n')).replace(/\r/g, '').replace(/\n{2,}/g, '\n');
		const lyricsTranslated = (responseText.split(`inner-text">`)[2].split("</div>")[0].replace(/\n/g, '').replace(/<br \/>/g, '\n')).replace(/\r/g, '');
		const parsedName = responseText.split('<h1 ')[1].split("</h1>")[0].split(`">`)[1];
		const metaData = withMetadata ? await this.getMetadata(responseText, true) : undefined;
		return new TekstowoAPILyrics(lyricsNormal, lyricsTranslated, metaData, parsedName);
	}
	/**
	 * Downloads and parses search result page for specified arguments.
	 * @deprecated Use `search` instead.
	 * @param {string} artist
	 * @param {string} songName
	 * @param {number} page
	 * @param {boolean} includePageCount Adds undocumented property, "INTERNAL_PAGE_COUNT" (not-enumerable) with value returned by TekstowoAPI#getPagesForSong.
	 * @returns {Promise<Object.<string, TekstowoAPILyricsID>>}
	 */
	// async searchLyrics(artist, songName, page, includePageCount = false) {
	// 	// if (artist == "")
	// 	// 	artist = undefined;
	// 	const requestOptions = new TekstowoAPIRequestOptions(
	// 		this.proxyThisUrl(TekstowoAPIUrls.SEARCH(artist, songName, page)), { method: "GET" },
	// 	);
	// 	const response = await this.makeRequest(requestOptions);
	// 	const responseText = unescapeJsonString(await response.text());
	// 	const base1 = responseText.split(`:</h2>`)[1].split(`<h2 class="`)[0];
	// 	const extractedIds = getTextBetween(base1, `<a href="/piosenka,`, `.html" class="`);
	// 	// const extractedNames = getTextBetween(base1, `<a href="/piosenka,`, `.html" class="`);
	// 	/**
	// 	 * @type {Object.<string, TekstowoAPILyricsID>}
	// 	 */
	// 	const base2 = {};
	// 	for (let i = 0; i < extractedIds.length; i++) {
	// 		const element = extractedIds[i];
	// 		const name = base1.split(`<a href="/piosenka,` + element + `.html" class="title" title="`)[1].split(`">`)[0];
	// 		base2[name] = element;
	// 	}
	// 	if (includePageCount)
	// 		Object.defineProperty(base2, "INTERNAL_PAGE_COUNT", { value: await this.getPagesForSong(artist, songName, responseText), enumerable: false });
	// 	return base2;
	// }
	async searchLyrics(artist, songName, page, includePageCount = false) {
		return await this.search(artist, songName, { page, includePageCount, onlySongs: true });
	}
	/**
	 * Downloads and parses search result page for specified arguments.
	 * @param {string} artist
	 * @param {string} songName
	 * @param {Object} options
	 * @param {number} options.page
	 * @param {boolean} options.includePageCount If `onlyArtists` or `onlySongs` is true, adds undocumented property, "INTERNAL_PAGE_COUNT" (not-enumerable) with value returned by TekstowoAPI#getPagesForSong. If not, sets the `pageCount` property of TekstowoAPISearchResults.
	 * @param {boolean} options.onlyArtists If true, skips extracting songs and returns only artist list.
	 * @param {boolean} options.onlySongs If true, skips extracting artists and returns only song list.
	 * @returns {Promise<Object.<string, TekstowoAPILyricsID | TekstowoAPIArtistID> | TekstowoAPISearchResults>}
	 */
	async search(artist, songName, options) {
		const { page, includePageCount, onlySongs, onlyArtists } = options;

		if (onlyArtists === true && onlySongs === true)
			throw new Error("Wong usage! Cannot have `onlySongs` and `onlyArtists` both true!");

		/* basic stuff */
		const requestOptions = new TekstowoAPIRequestOptions(
			this.proxyThisUrl(TekstowoAPIUrls.SEARCH(artist, songName, page)), { method: "GET" },
		);
		const response = await this.makeRequest(requestOptions);
		const responseText = unescapeJsonString(await response.text());
		// const baseForScrapping = responseText.split(`:</h2>`)[1].split(`<h2 class="`)[0];
		const baseForScrapping = responseText.split(`:</h2>`);
		// const songsNum = 1;
		const rawSongs = songName == "" ? "" : baseForScrapping[1].split("`<h2 class=")[0];
		const rawArtists = artist == "" ? "" : baseForScrapping[songName == "" ? 1 : 2].split(`<nav`)[0];
		const returnVal = new TekstowoAPISearchResults();
		if (includePageCount === true)
			returnVal.pageCount = await this.getPagesForSong(artist, songName, responseText);
		// debugger;
		const extractSongsList = async () => {
			/**
			 * @type {Object.<string, TekstowoAPILyricsID>}
			 */
			const base2 = {};
			const splitTarget = `<a href="/piosenka,`;
			const extractedIds = getTextBetween(rawSongs, splitTarget, `.html" class="`);
			for (let i = 0; i < extractedIds.length; i++) {
				const element = extractedIds[i];
				const name = rawSongs.split(splitTarget + element + `.html" class="title" title="`)[1].split(`">`)[0];
				base2[name] = element;
			}
			if (includePageCount === true && onlySongs === true)
				Object.defineProperty(base2, "INTERNAL_PAGE_COUNT", { value: returnVal.pageCount, enumerable: false });
			return base2;
		};
		const extractArtistsList = async () => {
			/**
			 * @type {Object.<string, TekstowoAPIArtistID>}
			 */
			const base2 = {};
			const splitTarget = `<a href="/piosenki_artysty,`;
			const extractedIds = getTextBetween(rawArtists, splitTarget, `.html" class="`);
			for (let i = 0; i < extractedIds.length; i++) {
				const element = extractedIds[i];
				const name = rawArtists.split(splitTarget + element + `.html" class="title" title="`)[1].split(`">`)[0];
				base2[name] = element;
			}
			if (includePageCount === true && onlyArtists === true)
				Object.defineProperty(base2, "INTERNAL_PAGE_COUNT", { value: returnVal.pageCount, enumerable: false });
			return base2;
		};
		if (onlySongs === true)
			return await extractSongsList();
		else if (onlyArtists === true)
			return await extractArtistsList();
		else {
			returnVal.songs = await extractSongsList();
			returnVal.artists = await extractArtistsList();
			return returnVal;
		}
	}
	/**
	 * Downloads and parses search result page and extracts pages count for specified arguments.
	 * Alternatively, if skipFetch is not empty (""), re-fetching will be skipped and it will use the supplied HTML string.
	 * @param {string} artist
	 * @param {string} songName
	 * @param {string} skipFetch
	 * @returns {Promise<number>}
	 */
	async getPagesForSong(artist, songName, skipFetch = "") {
		if (skipFetch == "") {
			const requestOptions = new TekstowoAPIRequestOptions(
				this.proxyThisUrl(TekstowoAPIUrls.SEARCH(artist, songName)), { method: "GET" },
			);
			const response = await this.makeRequest(requestOptions);
			skipFetch = unescapeJsonString(await response.text());
		}
		const responseText = skipFetch.split("\n").join("");
		const base1 = getTextBetween(responseText, `<a class="page-link" href="`, `.html" `);
		const last = base1[base1.length - 1];
		if (!last)
			return 1;
		// const duplicates = getDuplicates(base1);
		// const lastNum = last.split(",strona,").length > 1 ? last.split(",strona,")[1] : 1;
		const lastNum = last.split(",strona,")[1];
		const final = parseInt(lastNum);
		const split = getTextBetween(responseText, `<nav aria-label="`, `</nav>`);
		const altMethod = getTextBetween(split[0], `title="`, `"`).length;
		if (Math.abs(final - altMethod) > 3)
			return final;
		return altMethod;
	}
	/**
	 * Downloads and parses search result page, then from list of results selects closest name match for specified arguments.
	 * @param {string} artist
	 * @param {string} songName
	 * @returns {Promise<TekstowoAPILyrics | null>}
	 */
	async getLyrics(artist, songName) {
		if (artist == '')
			artist = undefined;
		// compare strings
		const results = await this.searchLyrics(artist, songName);
		const resultsMod = Object.keys(results).map(x => x.split(" - ")[1]);
		const resultsFinal = artist ? Object.keys(results) : resultsMod;
		const finalSearchString = artist ? artist + " - " + songName : songName;
		const a = findClosestString(levenshteinDistanceArray(resultsFinal, finalSearchString));
		// return a.closestString;
		// console.log(results);
		// console.log(a.closestString);
		const toExtract = resultsFinal.indexOf(a.closestString);
		return await this.extractLyrics(Object.values(results)[toExtract]);
	}
	/**
	 * Downloads, parses lyrics page and extracts "metrics" section for specified arguments.
	 * Alternatively, if useHTML is true, accepts HTML string from songIdOrHtml.
	 * @param {TekstowoAPILyricsID | string} songIdOrHtml
	 * @param {Boolean} useHTML
	 * @returns {Promise<TekstowoAPILyricsMetadata | null>}
	 */
	async getMetadata(songIdOrHtml, useHTML = false) {
		let responseText = null;
		if (!useHTML) {
			const requestOptions = new TekstowoAPIRequestOptions(
				this.proxyThisUrl(TekstowoAPIUrls.LYRICS(songIdOrHtml)), { method: "GET" },
			);
			const response = await this.makeRequest(requestOptions);
			responseText = unescapeJsonString(await response.text());
			const fail = responseText.replace(/\n{2,}/g, '\n').split("<title>")[1].split("</title>")[0].includes("404");
			if (fail)
				return null;
		}
		const htmlText = useHTML ? songIdOrHtml : responseText;
		const metricsTable = htmlText.split(`<div  class="metric">`)[1].split("</table>")[0];
		/**
		 * @param {string} htmlString
		 * @returns {{}}
		 */
		const parse = (htmlString) => {
			const names = getTextBetween(htmlString, "<tr><th>", '</th>').map(x => x.split(":")[0]);
			const infos = getTextBetween(htmlString, "</th><td><p>", '</td>').map((x, y) => y == 0 ? x.split("</p><a")[0] : x)
				.map(x => unescapeHtmlString(x.trimEnd()).replace(/\r/g, '').replace(/\n{2,}/g, '\n'))
				.map(x => x.endsWith("</p>") ? x.slice(0, -"</p>".length) : x);
			// possibly makes stuff break? /\
			return constructObject(names, infos);
		};
		return parse(metricsTable);
	}
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
// eslint-disable-next-line no-unused-vars
function getDuplicates(arr) {
	const results = [];
	arr.sort();
	let last = arr[0];
	for (let i = 1; i < arr.length; i++) {
		if (arr[i] == last) results.push(last);
		last = arr[i];
	}
	return results;
}

/**
 * @param {Array} keys
 * @param {Array} values
 * @returns {Object}
 */
function constructObject(keys, values) {
	const obj = {};
	for (let i = 0; i < keys.length; i++) {
		obj[keys[i]] = values[i];
	}
	return obj;
}

/**
 * @typedef Distance
 * @property {string} str
 * @property {number} distance
 */

/**
 * @typedef DistanceCompareResult
 * @property {string} closestString
 * @property {number} lowestDistance
 */

/**
 * @param {Array<Distance>} distances
 * @returns {DistanceCompareResult}
 */
function findClosestString(distances) {
	let lowestDistance = Infinity;
	let closestString = '';

	distances.forEach(({ str, distance }) => {
		if (distance < lowestDistance) {
			lowestDistance = distance;
			closestString = str;
		}
	});

	return {
		closestString: closestString,
		lowestDistance: lowestDistance,
	};
}

/**
 * @param {string[]} strArray
 * @param {string} targetStr
 * @returns {Array<Distance>}
 */
function levenshteinDistanceArray(strArray, targetStr) {
	const distances = [];

	for (let i = 0; i < strArray.length; i++) {
		const str = strArray[i];
		const distance = levenshteinDistance(str, targetStr);
		distances.push({ str, distance });
	}

	return distances;
}

/**
 * @param {string} str1
 * @param {string} str2
 * @returns {number}
 */
function levenshteinDistance(str1, str2) {
	const m = str1.length;
	const n = str2.length;

	/**
	 * @type {Array<Array<number>>}
	 */
	const dp = Array(m + 1)
		.fill(null)
		.map(() => Array(n + 1).fill(0));

	for (let i = 0; i <= m; i++) {
		dp[i][0] = i;
	}

	for (let j = 0; j <= n; j++) {
		dp[0][j] = j;
	}

	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			if (str1[i - 1] === str2[j - 1]) {
				dp[i][j] = dp[i - 1][j - 1];
			}
			else {
				dp[i][j] =
					1 +
					Math.min(
						dp[i - 1][j],
						dp[i][j - 1],
						dp[i - 1][j - 1],
					);
			}
		}
	}
	return dp[m][n];
}

// /**
//  * @param {string} x
//  * @returns {string}
//  */
// function filterOut(x) {
// 	return x.split("\n").filter(line => line !== "\n").join("");
// }

/**
 * @param {string} jsonString
 * @returns {string}
 */
function unescapeJsonString(jsonString) {
	return jsonString.replace(/\\["\\/bfnrtu]/g, match => {
		switch (match) {
			case '\\b':
				return '\b';
			case '\\f':
				return '\f';
			case '\\n':
				return '\n';
			case '\\r':
				return '\r';
			case '\\t':
				return '\t';
			case '\\/':
				return '/';
			case '\\"':
				return '"';
			case '\\\\':
				return '\\';
			default:
				if (match.slice(0, 2) === '\\u') {
					const codePoint = parseInt(match.slice(2), 16);
					return String.fromCharCode(codePoint);
				}
				return match;
		}
	});
}

/**
 * @param {string} htmlString
 * @returns {string}
 */
function unescapeHtmlString(htmlString) {
	return htmlString.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'");
}

/**
 * @param {string} text
 * @param {string} start
 * @param {string} end
 * @returns {string[]}
 */
function getTextBetween(text, start, end) {
	const results = [];
	let startIndex = 0;

	while (startIndex < text.length) {
		const startIdx = text.indexOf(start, startIndex);
		if (startIdx === -1) {
			break;
		}
		const endIdx = text.indexOf(end, startIdx + start.length);
		if (endIdx === -1) {
			break;
		}
		const match = text.substring(startIdx + start.length, endIdx);
		results.push(match);
		startIndex = endIdx + end.length;
	}
	return results;
}

module.exports = TekstowoAPI;
