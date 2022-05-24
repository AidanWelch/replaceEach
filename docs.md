## Functions

<dl>
<dt><a href="#replaceEach">replaceEach(originalString, searchValues, replaceValues)</a> ⇒ <code>string</code></dt>
<dd><p>Replaces each match in a string once, then returns the result</p>
</dd>
<dt><a href="#replaceEachAll">replaceEachAll(originalString, searchValues, replaceValues)</a> ⇒ <code>string</code></dt>
<dd><p>Replaces each occurence of a match in a string, then returns the result</p>
</dd>
<dt><a href="#replaceOne">replaceOne(originalString, searchValues, replaceValues)</a> ⇒ <code>string</code></dt>
<dd><p>Replaces the first occurence of a match in a string, then returns the result</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#replaceCallback">replaceCallback</a> ⇒ <code>string</code></dt>
<dd><p>Callback called to generate the replaceValue</p>
</dd>
<dt><a href="#searchCallback">searchCallback</a> ⇒ <code>boolean</code> | <code>&quot;complete&quot;</code></dt>
<dd><p>Callback called on a character to see if it matches</p>
</dd>
<dt><a href="#MatcherObject">MatcherObject</a> : <code>Object</code></dt>
<dd><p>Object used for keeping track of a specific searchValue</p>
</dd>
<dt><a href="#searchArrayCallback">searchArrayCallback</a> ⇒ <code>boolean</code></dt>
<dd></dd>
</dl>

<a name="replaceEach"></a>

## replaceEach(originalString, searchValues, replaceValues) ⇒ <code>string</code>
Replaces each match in a string once, then returns the result

**Kind**: global function  
**Returns**: <code>string</code> - String with first match of each searchValue replaced with respective replaceValues  

| Param | Type | Description |
| --- | --- | --- |
| originalString | <code>string</code> | String to search an replace |
| searchValues | <code>Array.&lt;(string\|searchCallback\|Array.&lt;(string\|searchArrayCallback)&gt;)&gt;</code> | Array of search patterns, either a string, a callback, or an array containing a value for each character in the pattern |
| replaceValues | <code>Array.&lt;(string\|replaceCallback)&gt;</code> | Array of values and/or callbacks(to call) to replace a match, defaults to last in the array if fewer replaceValues than searchValues |

<a name="replaceEachAll"></a>

## replaceEachAll(originalString, searchValues, replaceValues) ⇒ <code>string</code>
Replaces each occurence of a match in a string, then returns the result

**Kind**: global function  
**Returns**: <code>string</code> - String with every match of each searchValue replaced with respective replaceValues  

| Param | Type | Description |
| --- | --- | --- |
| originalString | <code>string</code> | String to search an replace |
| searchValues | <code>Array.&lt;(string\|searchCallback\|Array.&lt;(string\|searchArrayCallback)&gt;)&gt;</code> | Array of search patterns, either a string, a callback, or an array containing a value for each character in the pattern |
| replaceValues | <code>Array.&lt;(string\|replaceCallback)&gt;</code> | Array of values and/or callbacks(to call) to replace a match, defaults to last in the array if fewer replaceValues than searchValues |

<a name="replaceOne"></a>

## replaceOne(originalString, searchValues, replaceValues) ⇒ <code>string</code>
Replaces the first occurence of a match in a string, then returns the result

**Kind**: global function  
**Returns**: <code>string</code> - String with the first match of a searchValue replaced with the respective replaceValue  

| Param | Type | Description |
| --- | --- | --- |
| originalString | <code>string</code> | String to search an replace |
| searchValues | <code>Array.&lt;(string\|searchCallback\|Array.&lt;(string\|searchArrayCallback)&gt;)&gt;</code> | Array of search patterns, either a string, a callback, or an array containing a value for each character in the pattern |
| replaceValues | <code>Array.&lt;(string\|replaceCallback)&gt;</code> | Array of values and/or callbacks(to call) to replace a match, defaults to last in the array if fewer replaceValues than searchValues |

<a name="replaceCallback"></a>

## replaceCallback ⇒ <code>string</code>
Callback called to generate the replaceValue

**Kind**: global typedef  
**Returns**: <code>string</code> - String to use as replaceValue  

| Param | Type | Description |
| --- | --- | --- |
| match | <code>string</code> |  |
| matchStart | <code>number</code> | Index in the original string of the match |
| matchLength | <code>number</code> | Length of the match |

<a name="searchCallback"></a>

## searchCallback ⇒ <code>boolean</code> \| <code>&quot;complete&quot;</code>
Callback called on a character to see if it matches

**Kind**: global typedef  
**Returns**: <code>boolean</code> \| <code>&quot;complete&quot;</code> - Returns false if there is no match, "complete" if it is final match in the pattern closing it, or true otherwise  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | Index of the character being checked |
| c | <code>string</code> | Character being checked |
| matcher | [<code>MatcherObject</code>](#MatcherObject) | The matcher of this search |

<a name="MatcherObject"></a>

## MatcherObject : <code>Object</code>
Object used for keeping track of a specific searchValue

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| matchLength | <code>number</code> | Length of the current match |
| matchStart | <code>number</code> \| <code>null</code> | Index of the current match or null if there is none |
| replaceValue | <code>string</code> \| [<code>replaceCallback</code>](#replaceCallback) | Used to replace match |

<a name="searchArrayCallback"></a>

## searchArrayCallback ⇒ <code>boolean</code>
**Kind**: global typedef  
**Returns**: <code>boolean</code> - Returns true on match, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | Index of the character being checked |
| c | <code>string</code> | Character being checked |
| matcher | [<code>MatcherObject</code>](#MatcherObject) | The matcher of this search |

