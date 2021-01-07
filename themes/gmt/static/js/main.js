/*! learn-vanilla-js v1.0.0 | (c) 2021 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/learn-vanilla-js */
(function () {
	'use strict';

	/**
	 * Element.matches() polyfill (simple version)
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
	 */
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	}

	/**
	 *
	 * @param {Function} callback
	 */
	var mailchimp = function (callback) {


		//
		// Variables
		//

		// Fields
		var form = document.querySelector('#mailchimp-form');
		if (!form) return;
		var email = form.querySelector('#mailchimp-email');
		if (!email) return;
		var status = form.querySelector('#mc-status');
		var btn = form.querySelector('[data-processing]');

		// Messages
		var messages = {
			empty: 'Please provide an email address.',
			notEmail: 'Please use a valid email address.',
			success: 'Success! Thanks for inviting me to your inbox.'
		};

		// Endpoint
		var endpoint = 'https://gomakethings.com/checkout/wp-json/gmt-mailchimp/v1/subscribe';


		//
		// Methods
		//

		/**
		 * Serialize the form data into a query string
		 * https://stackoverflow.com/a/30153391/1293256
		 * @param  {Node}   form The form to serialize
		 * @return {String}      The serialized form data
		 */
		var serialize = function (form) {

			// Setup our serialized data
			var serialized = [];

			// Loop through each field in the form
			for (var i = 0; i < form.elements.length; i++) {

				var field = form.elements[i];

				// Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
				if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

				// Convert field data to a query string
				if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
					serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
				}
			}

			return serialized.join('&');

		};

		var addRole = function () {
			if (!status) return;
			status.setAttribute('role', 'status');
		};

		var clearStatus = function () {

			// Bail if there's no status container
			if (!status) return;

			// Wipe classes and update status HTML
			showStatus(btn.getAttribute('data-processing'), true);

		};

		var showStatus = function (msg, success) {

			// Bail if there's no status container
			if (!status) return;

			// Update the status message
			status.textContent = msg;

			// Set status class
			if (success) {
				status.className = 'success-message';
				email.className = '';
			} else {
				status.className = 'error-message';
				email.className = 'error';
			}

		};

		var sendData = function (params) {

			// Set up our HTTP request
			var xhr = new XMLHttpRequest();

			// Setup our listener to process compeleted requests
			xhr.onreadystatechange = function () {

				// Only run if the request is complete
				if ( xhr.readyState !== 4 ) return;

				// Show status message
				var success = xhr.status === 200 ? true : false;
				var response = JSON.parse(xhr.responseText);
				if (success) {
					showStatus(messages.success, success);
				} else {
					showStatus(response.message, success);
				}

				// Reenable button
				form.removeAttribute('data-submitting');


				// If there's a callback, run it
				if (callback && typeof callback === 'function') {
					callback(response);
				}

			};

			// Create and send a GET request
			// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
			// The second argument is the endpoint URL
			xhr.open('POST', endpoint + '?' + params);
			xhr.send();

		};

		// Submit the form
		var submitForm = function () {

			// Add submitting state
			form.setAttribute('data-submitting', true);

			// Send the data to the MailChimp API
			sendData(serialize(form));

		};

		var isEmail = function () {
			return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(email.value);
		};

		var validate = function () {

			// If no email is provided
			if (email.value.length < 1) {
				showStatus(messages.empty);
				return false;
			}

			// If email is not valid
			if (!isEmail()) {
				showStatus(messages.notEmail);
				return false;
			}

			return true;

		};

		var submitHandler = function (event) {

			// Stop form from submitting
			event.preventDefault();

			// Don't run again if form currrent submitting
			if (form.hasAttribute('data-submitting')) return;

			// Clear the status
			clearStatus();

			// Validate email
			var valid = validate();

			if (valid) {
				submitForm();
			}

		};


		//
		// Event Listeners & Inits
		//

		addRole();
		form.addEventListener('submit', submitHandler, false);

	};

	// Mailchimp form
	if (document.querySelector('#mailchimp-form')) {
		mailchimp(function (data) {
			if (data.code === 200) {
				window.location.href = 'https://gomakethings.com/newsletter-success';
			}
		});
	}

}());
