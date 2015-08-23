/*
 * Main module for the lorem ipsum chat, declares local vars, calls init() on
 *  load
 *
 */

(function main() {
	"use strict";

	// Local vars
	var words,       // object for lorem ipsum JSON
	    chatInput,   // chat input
	    history,     // chat history window
	    isTyping;    // global boolean to prevent multiple asynchronous responses


	/*
	 * init - initializes XMLHttpRequest, reads in the words object, and adds
	 * event listeners
	 *
	 */
	function init () {
		var xhr,
		    success;

		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		}
		else {
			window.alert("Your browser does not support XMLHttpRequest. Please upgrade your browser to view this demo.");
			return false;
		}

		xhr.open("get", "data/words.json", true);
		// xhr.overrideMimeType("application/json");
		xhr.send(null);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				words = JSON.parse(xhr.responseText);
			}
			else
				console.log("Ready state:" + xhr.readyState + " Status: " + xhr.status);
		};

		// Get JSON using AJAX, parse to obj
		chatInput = document.getElementById("chat");
		chatInput.addEventListener("keyup", parseText, false);
		history = document.getElementById("history");

		isTyping = false;
	}


	/**
	 * parseText is the callback for the keyup eventlistener, and listens for
	 * enter key to be pressed, signaling that the user has entered a message.
	 *
	 * @param {Event} event          - keyup from chatInput
	 *
	 */
	function parseText(event) {
		var message;

		if (event.keyCode === 13 && chatInput.value) {
			message = chatInput.value.trim();

			// message is "sent" and triggers bot "response" with small delay
			if (message !== "") {
				chatInput.value = "";
				sendMessage("user", message);
				// Only respond to one message at a time
				if(!isTyping) {
					isTyping = true;
					setTimeout(function () {
						respondTo(message);
					}, Math.random() * (4000) + 1000);
				}
			}
		}
	}


	/**
	 * sendMessage sends a message with an optional delay and posts it to the
	 * .chat_history window.
	 *
	 * @param  {String} from       - "user", "bot" class
	 * @param  {String} message    - message
	 * @param  {Number} delay      - delay in MS
	 *
	 */
	function sendMessage(from, message, delay) {
		var p,                 // paragraph element for message
		    img,               // image for avatar
		    innerDiv,          // inner div to hold animation and avatar
		    outerDiv,          // outer div for clearing floats
		    animationSequence, // class list for animation
		    position;          // left or right

		// paragraph
		p = document.createElement("p");

		// img
		img = document.createElement("img");

		if (from === "bot") {
			img.src = "img/helmet1.svg";
			position = "left";
		}
		else if (from === "user") {
			img.src = "img/user168.svg";
			position = "right";
		}

		img.classList.add("avatar", "middle", position);

		// inner div
		innerDiv = document.createElement("div");
		innerDiv.appendChild(img);
		innerDiv.classList.add(from);

		// add animation, remove animation, add message
		if (delay) {
			addAnimation(innerDiv);
			setTimeout(function () {
				removeAnimation(innerDiv);
				p.appendChild(document.createTextNode(message));
				innerDiv.appendChild(p);
				isTyping = false;
			}, delay);
		}
		else {
			// no delay, just post it
			p.appendChild(document.createTextNode(message));
			innerDiv.appendChild(p);
		}

		//outer div
		outerDiv = document.createElement("div");
		outerDiv.appendChild(innerDiv);
		outerDiv.classList.add("full");

		// history
		history.appendChild(outerDiv);
		history.scrollTop = history.scrollHeight;
	}


	/*
	 * respondTo responds to the user's message by picking random lorem ipsum
	 * words from the words object.
	 *
	 * @param  {String} message    - incoming message string
	 *
	 */
	function respondTo(message) {

		var response = "", // String to hold generated response
		    numWords,      // number of words in response
		    numChars,      // number of characters in word
		    selectedWord,  // index of selected word (by length)
		    delay,         // chat bot delay in ms
		    msgLength,     // number of words in @message String
		    comma;         // optional comma

		// short sentences typically get short responses.
		if (message.indexOf(" ") === -1)
			msgLength = 1;
		else
			msgLength = message.split(" ").length;

		// maximum response length is 2 more words than the incoming message
		numWords = Math.ceil(Math.random() * (msgLength + 2));

		// longer sentences should get a comma
		if (numWords > 8)
			comma = Math.ceil(numWords / 2);

		// simulated delayed response
		delay = Math.ceil(Math.random() * (numWords + 1) * 1000) + 2500;

		// build the response
		while (numWords > 0) {

			// pick a word, but don't repeat the last one!
			do {
				numChars = wordLengthByFrequency();
				selectedWord = Math.floor(Math.random() * words[numChars].length);
			}
			while (words[numChars][selectedWord] == response.split(" ").pop().toLowerCase());

			// Capitalize first word only
			if (!response) {
				response = capitalizeWord(words[numChars][selectedWord]);
			}
			else
				response += words[numChars][selectedWord];

			// comma?
			if (comma && numWords === comma)
				response += ',';

			numWords--;

			// last word? add punctuation, if not add a space
			response += (numWords === 0) ? getPunctuation() : " ";
		}

		sendMessage("bot", response, delay);
	}


	/**
	 * addAnimation adds the "typing" animation to element by appending the
	 * animation sequence divs to the target element.
	 *
	 * @param {HTMLElement} element  - the target Element
	 *
	 */
	function addAnimation (element) {
		var animationSequence = ["one","two","three"];

		animationSequence.forEach(function (animationClass) {
			var newDiv = document.createElement("div");
			newDiv.classList.add("bouncer", animationClass);
			element.appendChild(newDiv);
		});
	}


	/**
	 * removeAnimation removes the "typing" animation by removing all of the
	 * child divs of the target element.
	 *
	 * @param  {HTMLElement} element - the target Element
	 *
	 */
	function removeAnimation (element) {
		var i = element.childNodes.length - 1;

		for ( ; i >= 0; i--)
			if (element.childNodes[i].tagName === "DIV")
				element.removeChild(element.childNodes[i]);
	}


	/**
	 * capitalizeWord takes in a lowercase string and returns it with the first
	 * letter capitalized.
	 *
	 * @param  {String} word - the word to capitalize
	 * @return {String}      - the capitalized word
	 */
	function capitalizeWord(word) {
		return  word.charAt(0).toUpperCase() + word.slice(1);
	}


	/**
	 * wordLengthByFrequency provides a Normal (Gaussian) distribution for word
	 * lengths. Higher length words are called less frequently.
	 *
	 */
	function wordLengthByFrequency() {

		var rndm,  // a random number between 1-100
		    dist,  // the distribution (in %) of the frequency of our words
		    i,     // loop counter
		    limit; // upper range limit for test

		rndm = Math.floor(Math.random() * 100);
		dist = [5, 7, 9, 13, 20, 13, 9, 5, 4, 4, 3, 2, 2, 2, 1, 1];

		for (i = 0, limit = 0; i < 16; i++) {
			limit += dist[i];
			if (rndm <= limit) {
				return ++i;
			}
		}
	}


	/**
	 * getPunctuation returns a random punctuation mark based on frequency.
	 *  There is a 10% chance of an exclamation point or question mark, and an
	 *  80% chance for a period.
	 *
	 */

	function getPunctuation() {
		var mark = Math.ceil(Math.random() * 10);

		if (mark == 9)
			return '?';
		else if (mark == 10)
			return '!';
		else
			return '.';
	}

	// add event listener for page load
	window.addEventListener("load", init, false);

})();