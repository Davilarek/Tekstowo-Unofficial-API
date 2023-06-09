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
};

// eslint-disable-next-line no-unused-vars
class TekstowoAPILyricsID extends String { }

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
	 */
	constructor(original, translated) {
		this.original = original;
		this.translated = translated;
	}
}

class TekstowoAPI {
	/**
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
	 * @param {TekstowoAPIRequestOptions} options
	 * param {object} options
	 * param {string} options.url
	 * param {RequestInit} options.fetchOptions
	 */
	async makeRequest(options) {
		const localFetch = this.FetchImpl;
		return await localFetch(options.url, options.fetchOptions);
	}
	/**
	 * @param {string} url
	 */
	proxyThisUrl(url) {
		switch (this.proxyMetod) {
			case TekstowoAPIProxyMethods.AllOrigins:
				return "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
			default:
				return url;
		}
	}
	/**
	 * @param {TekstowoAPILyricsID} songId
	 */
	async extractLyrics(songId) {
		const requestOptions = new TekstowoAPIRequestOptions(
			this.proxyThisUrl(TekstowoAPIUrls.LYRICS(songId)), { method: "GET" },
		);
		const response = await this.makeRequest(requestOptions);
		const responseText = unescapeJsonString(await response.text());
		const fail = responseText.replace(/\n{2,}/g, '\n').split("<title>")[1].split("</title>")[0].includes("404");
		if (fail)
			return null;
		const lyricsNormal = (responseText.split(`inner-text">`)[1].split("</div>")[0].replace(/<br \/>/g, '\n')).replace(/\n{2,}/g, '\n');
		const lyricsTranslated = (responseText.split(`inner-text">`)[2].split("</div>")[0].replace(/<br \/>/g, '\n')).replace(/\n{2,}/g, '\n');
		return new TekstowoAPILyrics(lyricsNormal, lyricsTranslated);
	}
	/**
	 * @param {string} artist
	 * @param {string} songName
	 * @param {number} page
	 */
	async searchLyrics(artist, songName, page) {
		// if (artist == "")
		// 	artist = undefined;
		const requestOptions = new TekstowoAPIRequestOptions(
			this.proxyThisUrl(TekstowoAPIUrls.SEARCH(artist, songName, page)), { method: "GET" },
		);
		const response = await this.makeRequest(requestOptions);
		const responseText = unescapeJsonString(await response.text());
		const base1 = responseText.split(`:</h2>`)[1].split(`<h2 class="`)[0];
		const extractedIds = getTextBetween(base1, `<a href="/piosenka,`, `.html" class="`);
		// const extractedNames = getTextBetween(base1, `<a href="/piosenka,`, `.html" class="`);
		/**
		 * @type {Object.<string, TekstowoAPILyricsID>}
		 */
		const base2 = {};
		for (let i = 0; i < extractedIds.length; i++) {
			const element = extractedIds[i];
			const name = base1.split(`<a href="/piosenka,` + element + `.html" class="title" title="`)[1].split(`">`)[0];
			base2[name] = element;
		}
		return base2;
	}
	/**
	 * @param {string} artist
	 * @param {string} songName
	 */
	async getPagesForSong(artist, songName) {
		const requestOptions = new TekstowoAPIRequestOptions(
			this.proxyThisUrl(TekstowoAPIUrls.SEARCH(artist, songName)), { method: "GET" },
		);
		const response = await this.makeRequest(requestOptions);
		const responseText = unescapeJsonString(await response.text()).split("\n").join("");
		const base1 = getTextBetween(responseText, `<li class="page-item"><a class="page-link" href="`, `.html" `);
		const last = base1[base1.length - 1];
		if (!last)
			return 1;
		// const lastNum = last.split(",strona,").length > 1 ? last.split(",strona,")[1] : 1;
		const lastNum = last.split(",strona,")[1];
		return parseInt(lastNum);
	}
	/**
	 * @param {string} artist
	 * @param {string} songName
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
}

/**
 * @param {Array<{str: string; distance: number;}>} distances
 * @returns
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
 * @returns
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
 * @returns
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
