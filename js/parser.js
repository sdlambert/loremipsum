// Lorem ipsum parser
(function main() {
	"use strict";

	var text, textIn, result;

	function init () {
		textIn = document.getElementById("text");
		result = document.getElementById("result");
		textIn.addEventListener("input", parseText, false);
	}

	function parseText (e) {
		var uniques = [],
				sortedWords = {};
		// grab value
		text = textIn.value;

		// remove all punctuation, transform to lowercase
		text = text.split(" ").map(function (word) {
			return word.split("").filter(function (letter) {
				return /\w/.test(letter);
			}).join("").toLowerCase();
		});

		// remove duplicates and sort alphabetically
		uniques = text.filter(function (word, index) {
			if (text.indexOf(word, index + 1) === -1)
				return word;
		}).sort();

		// Build word object sorted by word length
		uniques.forEach(function (word) {
			if (!sortedWords[word.length])
				sortedWords[word.length] = [];
			sortedWords[word.length].push(word);
		});

		// Turn into JSON, output

		result.value = JSON.stringify(sortedWords);
	}

	// add event listener for page load
	window.addEventListener("load", init, false);

})();