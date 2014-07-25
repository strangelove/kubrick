'use strict';

module.exports = function () {
	var slice = Array.prototype.slice,
		pre = slice.call(window.getComputedStyle(document.documentElement))
			.join('')
			.match(/-(webkit|moz|ms|o)-transform/)[1];
	return pre[0].toUpperCase() + pre.substr(1);
};