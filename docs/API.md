## Classes

<dl>
<dt><a href="#TekstowoAPIRequestOptions">TekstowoAPIRequestOptions</a></dt>
<dd></dd>
<dt><a href="#TekstowoAPILyrics">TekstowoAPILyrics</a></dt>
<dd></dd>
<dt><a href="#TekstowoAPI">TekstowoAPI</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#constructObject">constructObject(keys, values)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#findClosestString">findClosestString(distances)</a> ⇒ <code><a href="#DistanceCompareResult">DistanceCompareResult</a></code></dt>
<dd></dd>
<dt><a href="#levenshteinDistanceArray">levenshteinDistanceArray(strArray, targetStr)</a> ⇒ <code><a href="#Distance">Array.&lt;Distance&gt;</a></code></dt>
<dd></dd>
<dt><a href="#levenshteinDistance">levenshteinDistance(str1, str2)</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#unescapeJsonString">unescapeJsonString(jsonString)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#unescapeHtmlString">unescapeHtmlString(htmlString)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getTextBetween">getTextBetween(text, start, end)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TekstowoAPILyricsMetadata">TekstowoAPILyricsMetadata</a></dt>
<dd><p>just an Object</p>
</dd>
<dt><a href="#Distance">Distance</a></dt>
<dd></dd>
<dt><a href="#DistanceCompareResult">DistanceCompareResult</a></dt>
<dd></dd>
</dl>

<a name="TekstowoAPIRequestOptions"></a>

## TekstowoAPIRequestOptions
**Kind**: global class  
<a name="new_TekstowoAPIRequestOptions_new"></a>

### new TekstowoAPIRequestOptions(url, fetchOptions)

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| fetchOptions | <code>RequestInit</code> | 

<a name="TekstowoAPILyrics"></a>

## TekstowoAPILyrics
**Kind**: global class  
<a name="new_TekstowoAPILyrics_new"></a>

### new TekstowoAPILyrics(original, translated, metadata, lyricsName)

| Param | Type |
| --- | --- |
| original | <code>string</code> | 
| translated | <code>string</code> | 
| metadata | <code>Object</code> | 
| lyricsName | <code>string</code> | 

<a name="TekstowoAPI"></a>

## TekstowoAPI
**Kind**: global class  

* [TekstowoAPI](#TekstowoAPI)
    * [new TekstowoAPI(FetchImpl, proxyMetod)](#new_TekstowoAPI_new)
    * [.FetchImpl](#TekstowoAPI+FetchImpl) : <code>fetch</code>
    * [.makeRequest(options)](#TekstowoAPI+makeRequest) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.proxyThisUrl(url)](#TekstowoAPI+proxyThisUrl) ⇒ <code>string</code>
    * [.extractLyrics(songId, withMetadata)](#TekstowoAPI+extractLyrics) ⇒ <code>Promise.&lt;(TekstowoAPILyrics\|null)&gt;</code>
    * [.searchLyrics(artist, songName, page, includePageCount)](#TekstowoAPI+searchLyrics) ⇒ <code>Promise.&lt;Object.&lt;string, TekstowoAPILyricsID&gt;&gt;</code>
    * [.getPagesForSong(artist, songName, skipFetch)](#TekstowoAPI+getPagesForSong) ⇒ <code>Promise.&lt;number&gt;</code>
    * [.getLyrics(artist, songName)](#TekstowoAPI+getLyrics) ⇒ <code>Promise.&lt;(TekstowoAPILyrics\|null)&gt;</code>
    * [.getMetadata(songIdOrHtml, useHTML)](#TekstowoAPI+getMetadata) ⇒ <code>Promise.&lt;(TekstowoAPILyricsMetadata\|null)&gt;</code>

<a name="new_TekstowoAPI_new"></a>

### new TekstowoAPI(FetchImpl, proxyMetod)
Creates a new TekstowoAPI instance


| Param | Type |
| --- | --- |
| FetchImpl | <code>fetch</code> | 
| proxyMetod | [<code>TekstowoAPIProxyMethods</code>](#TekstowoAPIProxyMethods) | 

<a name="TekstowoAPI+FetchImpl"></a>

### tekstowoAPI.FetchImpl : <code>fetch</code>
**Kind**: instance property of [<code>TekstowoAPI</code>](#TekstowoAPI)  
<a name="TekstowoAPI+makeRequest"></a>

### tekstowoAPI.makeRequest(options) ⇒ <code>Promise.&lt;Response&gt;</code>
Makes a request using TekstowoAPI#FetchImpl.

**Kind**: instance method of [<code>TekstowoAPI</code>](#TekstowoAPI)  
**See**: TekstowoAPI#FetchImpl  

| Param | Type |
| --- | --- |
| options | [<code>TekstowoAPIRequestOptions</code>](#TekstowoAPIRequestOptions) | 

<a name="TekstowoAPI+proxyThisUrl"></a>

### tekstowoAPI.proxyThisUrl(url) ⇒ <code>string</code>
Selects a proxy using TekstowoAPI#proxyMetod.

**Kind**: instance method of [<code>TekstowoAPI</code>](#TekstowoAPI)  
**See**: TekstowoAPI#proxyMetod  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="TekstowoAPI+extractLyrics"></a>

### tekstowoAPI.extractLyrics(songId, withMetadata) ⇒ <code>Promise.&lt;(TekstowoAPILyrics\|null)&gt;</code>
Downloads and parses lyrics page for specified arguments.

**Kind**: instance method of [<code>TekstowoAPI</code>](#TekstowoAPI)  

| Param | Type | Default |
| --- | --- | --- |
| songId | <code>TekstowoAPILyricsID</code> |  | 
| withMetadata | <code>boolean</code> | <code>false</code> | 

<a name="TekstowoAPI+searchLyrics"></a>

### tekstowoAPI.searchLyrics(artist, songName, page, includePageCount) ⇒ <code>Promise.&lt;Object.&lt;string, TekstowoAPILyricsID&gt;&gt;</code>
Downloads and parses search result page for specified arguments.

**Kind**: instance method of [<code>TekstowoAPI</code>](#TekstowoAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| artist | <code>string</code> |  |  |
| songName | <code>string</code> |  |  |
| page | <code>number</code> |  |  |
| includePageCount | <code>boolean</code> | <code>false</code> | Adds undocumented property, "INTERNAL_PAGE_COUNT" (not-enumerable) with value returned by TekstowoAPI#getPagesForSong. |

<a name="TekstowoAPI+getPagesForSong"></a>

### tekstowoAPI.getPagesForSong(artist, songName, skipFetch) ⇒ <code>Promise.&lt;number&gt;</code>
Downloads and parses search result page and extracts pages count for specified arguments.Alternatively, if skipFetch is not empty (""), re-fetching will be skipped and it will use the supplied HTML string.

**Kind**: instance method of [<code>TekstowoAPI</code>](#TekstowoAPI)  

| Param | Type |
| --- | --- |
| artist | <code>string</code> | 
| songName | <code>string</code> | 
| skipFetch | <code>string</code> | 

<a name="TekstowoAPI+getLyrics"></a>

### tekstowoAPI.getLyrics(artist, songName) ⇒ <code>Promise.&lt;(TekstowoAPILyrics\|null)&gt;</code>
Downloads and parses search result page, then from list of results selects closest name match for specified arguments.

**Kind**: instance method of [<code>TekstowoAPI</code>](#TekstowoAPI)  

| Param | Type |
| --- | --- |
| artist | <code>string</code> | 
| songName | <code>string</code> | 

<a name="TekstowoAPI+getMetadata"></a>

### tekstowoAPI.getMetadata(songIdOrHtml, useHTML) ⇒ <code>Promise.&lt;(TekstowoAPILyricsMetadata\|null)&gt;</code>
Downloads, parses lyrics page and extracts "metrics" section for specified arguments.Alternatively, if useHTML is true, accepts HTML string from songIdOrHtml.

**Kind**: instance method of [<code>TekstowoAPI</code>](#TekstowoAPI)  

| Param | Type | Default |
| --- | --- | --- |
| songIdOrHtml | <code>TekstowoAPILyricsID</code> \| <code>string</code> |  | 
| useHTML | <code>Boolean</code> | <code>false</code> | 

<a name="TekstowoAPIProxyMethods"></a>

## TekstowoAPIProxyMethods : <code>enum</code>
**Kind**: global enum  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| None | <code>number</code> | <code>0</code> | 
| AllOrigins | <code>number</code> | <code>1</code> | 
| SirJoshProxy | <code>number</code> | <code>2</code> | 

<a name="constructObject"></a>

## constructObject(keys, values) ⇒ <code>Object</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| keys | <code>Array</code> | 
| values | <code>Array</code> | 

<a name="findClosestString"></a>

## findClosestString(distances) ⇒ [<code>DistanceCompareResult</code>](#DistanceCompareResult)
**Kind**: global function  

| Param | Type |
| --- | --- |
| distances | [<code>Array.&lt;Distance&gt;</code>](#Distance) | 

<a name="levenshteinDistanceArray"></a>

## levenshteinDistanceArray(strArray, targetStr) ⇒ [<code>Array.&lt;Distance&gt;</code>](#Distance)
**Kind**: global function  

| Param | Type |
| --- | --- |
| strArray | <code>Array.&lt;string&gt;</code> | 
| targetStr | <code>string</code> | 

<a name="levenshteinDistance"></a>

## levenshteinDistance(str1, str2) ⇒ <code>number</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| str1 | <code>string</code> | 
| str2 | <code>string</code> | 

<a name="levenshteinDistance..dp"></a>

### levenshteinDistance~dp : <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
**Kind**: inner constant of [<code>levenshteinDistance</code>](#levenshteinDistance)  
<a name="unescapeJsonString"></a>

## unescapeJsonString(jsonString) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| jsonString | <code>string</code> | 

<a name="unescapeHtmlString"></a>

## unescapeHtmlString(htmlString) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| htmlString | <code>string</code> | 

<a name="getTextBetween"></a>

## getTextBetween(text, start, end) ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 
| start | <code>string</code> | 
| end | <code>string</code> | 

<a name="TekstowoAPILyricsMetadata"></a>

## TekstowoAPILyricsMetadata
just an Object

**Kind**: global typedef  
<a name="Distance"></a>

## Distance
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| str | <code>string</code> | 
| distance | <code>number</code> | 

<a name="DistanceCompareResult"></a>

## DistanceCompareResult
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| closestString | <code>string</code> | 
| lowestDistance | <code>number</code> | 

*Generated by awesome [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown)* 
