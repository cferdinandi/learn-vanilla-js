var saveRoadmap = function () {

	'use strict';

	/**
	 * Get data from localStorage
	 * @return {Array} The data
	 */
	var getData = function () {
		var data = localStorage.getItem('vanillaJSRoadmap');
		return (data ? JSON.parse(data) : []);
	};

	/**
	 * Save data to localStorage
	 * @param  {Array} data The data
	 */
	var saveData = function (data) {
		localStorage.setItem('vanillaJSRoadmap', JSON.stringify(data));
	};

	/**
	 * Load localStorage data into the DOM
	 */
	var loadData = function () {
		var checkboxes = document.querySelectorAll('[data-save]');
		var data = getData();
		if (data.length < 1) return;
		Array.prototype.forEach.call(checkboxes, function (checkbox) {
			if (data.indexOf(checkbox.id) > -1) {
				checkbox.checked = true;
			}
		});
	};

	/**
	 * On click, save checkbox state
	 */
	var clickHandler = function (event) {
		if (!event.target.hasAttribute('data-save')) return;
		var data = getData();
		if (event.target.checked) {
			data.push(event.target.id);
		} else {
			var index = data.indexOf(event.target.id);
			if (index > -1) {
				data.splice(index, 1);
			}
		}
		saveData(data);
	};

	/**
	 * Init Plugin
	 */

	loadData();
	document.documentElement.addEventListener('click', clickHandler, false);

};