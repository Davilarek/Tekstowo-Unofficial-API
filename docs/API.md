# API Reference
>## [TekstowoAPI](#tekstowoapi-class) class
- [`constructor`](#tekstowoapiconstructor)
- (async) [`makeRequest`](#async-tekstowoapimakerequest)
- [`proxyThisUrl`](#async-tekstowoapiproxythisurl)
- (async) [`extractLyrics`](#async-tekstowoapiextractlyrics)
- (async) [`searchLyrics`](#async-tekstowoapisearchlyrics)
- (async) [`getPagesForSong`](#async-tekstowoapigetpagesforsong)
- (async) [`getLyrics`](#async-tekstowoapigetlyrics)

## `TekstowoAPI.constructor`
### Arguments:
- `FetchImpl` type: `fetch`
- `proxyMetod` type: `TekstowoAPIProxyMethods`, default: `TekstowoAPIProxyMethods.AllOrigins`

### Description:<br>
Creates a new TekstowoAPI instance

## async `TekstowoAPI.makeRequest`
### Arguments:
- `options` type: `TekstowoAPIRequestOptions`

### Return value:
`Response`

### Description:<br>
Makes a request using [`FetchImpl`](#arguments).

## `TekstowoAPI.proxyThisUrl`
### Arguments:
- `url` type: `string`

### Return value:
`string`

### Description:<br>
Selects a proxy using [`proxyMetod`](#arguments).

## async `TekstowoAPI.extractLyrics`
### Arguments:
- `songId` type: `string`

### Return value:
`TekstowoAPILyrics` or `null`

### Description:<br>
Downloads and parses lyrics page for specified [arguments](#arguments-3).

## async `TekstowoAPI.searchLyrics`
### Arguments:
- `artist` type: `string`
- `songName` type: `string`
- `page` type: `number`

### Return value:
An object with the following structure:<br>
`artist - songName`: `songId`

### Description:<br>
Downloads and parses search result page for specified [arguments](#arguments-4).

## async `TekstowoAPI.getPagesForSong`
### Arguments:
- `artist` type: `string`
- `songName` type: `string`

### Return value:
`number`

### Description:<br>
Downloads and parses search result page and extracts pages count for specified [arguments](#arguments-5).

## async `TekstowoAPI.getLyrics`
### Arguments:
- `artist` type: `string`
- `songName` type: `string`

### Return value:
`TekstowoAPILyrics` or `null`

### Description:<br>
Downloads and parses search result page, then from list of results selects closest name match for specified [arguments](#arguments-6).
