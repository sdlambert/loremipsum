// Lorem ipsum parser
(function main() {
	"use strict";

	var textIn, // textarea element for input
	    result, // textarea element for output
	    text;   // parsed text string, containing only words without punctuation

	/**
	 * init grabs the necessary input and output elements and listens for input
	 * @return null
	 */
	function init () {
		textIn = document.getElementById("text");
		result = document.getElementById("result");
		textIn.addEventListener("input", parseText, false);
	}

  /**
   * parseText removes punctuation, identifies words, transforms those words
   * to lowercase, sorts alphabetically, removes duplicates, and places them
   * into an object with word lengths as keys and an array of words of said
   * length as the value.
   *
   * @param  {Event} e - input event, called each time the user types
   * @return null
   */
	function parseText (e) {
		var uniques = [],
		    sortedWords = {};

		// remove all punctuation, transform to lowercase
		text = textIn.value.split(" ").map(function (word) {
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