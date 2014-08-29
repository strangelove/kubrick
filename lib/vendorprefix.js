'use strict';

module.exports = function () {
	var slice = Array.prototype.slice,
		pre = slice.call(window.getComputedStyle(document.documentElement))
			.join('')
			.match(/-(webkit|moz|ms|o)-/)[1];
	if (pre == 'ms') return pre;
	return pre[0].toUpperCase() + pre.substr(1);
};
