'use strict';

module.exports = function(t, b, c, d){
	return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};
