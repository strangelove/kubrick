'use strict';

var isArray = require('mout/lang/isArray'),
	isString = require('mout/lang/isString'),
	getScrollTop = require('./lib/scrolltop'),
	prefix = require('./lib/vendorprefix')(),
	easing = require('./easing');

/**
 * Kubrick
 * @param {Array} scenes
 */
var Kubrick = function(scenes){
	if (!(this instanceof Kubrick)){
		return new Kubrick(scenes);
	}

	this.scenes = [];
	this.currentScene = -1;
	this.isTouchDevice = false;
	this.addScenes(scenes);
	this.movedTotal = 0;
	this.setup();

	var self = this;
	setInterval(function(){
		window.requestAnimationFrame(function(){
			self.setScrollTop();

			if (self.scrollTop > -1){
				self.setScene();
				self.action();
			}
		});
	}, 10);
};

/**
 * Available properties
 */
Kubrick.prototype.properties = ['translateX', 'translateY', 'translateZ', 'rotate', 'scale', 'opacity'];

/**
 * Add scene(s)
 *
 * This will check if the desired stages + actors exist and cache them
 * @param {Array} scenes
 */
Kubrick.prototype.addScenes = function(scenes){
	if (!isArray(scenes)){
		scenes = [scenes];
	}

	var i, len = scenes.length, stage, actors, j, actor, prop;
	for (i = 0; i < len; i++){
		if (!scenes[i].duration) continue;

		stage = scenes[i].stage ? document.querySelector(scenes[i].stage) : null;
		scenes[i].stage = stage;

		if (!scenes[i].easing || !easing[scenes[i].easing]){
			scenes[i].easing = 'easeInOutQuad';
		}

		if (scenes[i].actors && scenes[i].actors.length){
			actors = [];
			for (j = 0; j < scenes[i].actors.length; j++){
				actor = scenes[i].actors[j];
				actor.element = (stage || document).querySelector(actor.element);
				if (!actor.element) continue;

				for (prop in actor){
					if (prop == 'element' || !actor.hasOwnProperty(prop)) continue;
					if (!isArray(actor[prop]) && prop !== 'callback'){
						actor[prop] = [this.getDefaultValue(prop), actor[prop]];
					}
				}
				actors.push(actor);
			}
			scenes[i].actors = actors;
		}

		this.scenes.push(scenes[i]);
	}
};

/**
 * Set the scene
 */
Kubrick.prototype.setup = function(){
	this.windowWidth = window.innerWidth;
	this.windowHeight = window.innerHeight;
	this.setTouchEvents();
	this.init();
};

/**
 *
 */
Kubrick.prototype.setTouchEvents = function(){
	var self = this, moved = 0, touchStartY = 0,
		touchStart = function(e){
			self.isTouchDevice = true;
			moved = 0;
			var touch = e.touches[0] || e.changedTouches[0];
			touchStartY = touch.pageY;
		},
		touchMove = function(e){
			e.preventDefault();
			var touch = e.touches[0] || e.changedTouches[0];
			moved = touch.pageY - touchStartY;
			self.movedTotal -= moved;
			touchStartY = touch.pageY;
		},
		touchEnd = function(){
			var inertiaInterval = setInterval(function(){
				moved *= 0.95;
				self.movedTotal -= moved;
				if (Math.abs(moved) < 0.2){
					clearInterval(inertiaInterval);
				}
			}, 10);
		};

	if (window.addEventListener){
		window.addEventListener('touchstart', touchStart);
		window.addEventListener('touchmove', touchMove);
		window.addEventListener('touchend', touchEnd);
	} else if (window.attachEvent){
		window.attachEvent('ontouchstart', touchStart);
		window.attachEvent('ontouchmove', touchStart);
		window.attachEvent('ontouchend', touchStart);
	}
};

/**
 * Set the page's current scroll top
 */
Kubrick.prototype.setScrollTop = function(){
	if (this.isTouchDevice){
		this.scrollTop = this.movedTotal;
	} else {
		this.scrollTop = getScrollTop();
	}
};

/**
 * Initial setup
 */
Kubrick.prototype.init = function(){
	var start = 0, i, len = this.scenes.length, scene, j, actor, prop, value, k;
	for (i = 0; i < len; i++){
		scene = this.scenes[i];
		scene.start = start;
		scene.total = Math.ceil(this.percentToPx(scene.duration, 'y'));
		start += scene.total;
		scene.end = start;
	}

	start += this.windowHeight;
	this.scenes[this.scenes.length - 1].end = start;
	document.body.style.height = (start) + 'px';
	this.setScrollTop();

	for (i = 0; i < len; i++){
		scene = this.scenes[i];
		if ((this.scrollTop < scene.start || this.scrollTop > scene.end) && scene.stage){
			scene.stage.style.display = 'none';
		}

		if (!scene.actors || !scene.actors.length) continue;

		for (j = 0; j < scene.actors.length; j++){
			actor = scene.actors[j];
			for (prop in actor){
				if (prop == 'element' || !actor.hasOwnProperty(prop)) continue;

				value = actor[prop];
				for (k = 0; k < value.length; k++){
					if (isString(value[k])){
						value[k] = this.percentToPx(value[k], prop == 'translateX' ? 'x' : 'y');
					}
				}
			}
		}
	}
};

/**
 * Convert a percent value to pixels
 */
Kubrick.prototype.percentToPx = function(value, axis){
	if (isString(value) && value.match(/%$/)){
		value = (parseFloat(value) / 100) * (axis == 'x' ? this.windowWidth : this.windowHeight);
	}
	return value;
};

/**
 * Get default value for a property
 */
Kubrick.prototype.getDefaultValue = function(prop){
	switch (prop) {
		case 'translateX':
		case 'translateY':
		case 'translateZ':
		case 'rotate':
			return 0;
		case 'scale':
		case 'opacity':
			return 1;
	}
};

/**
 * Determine which scene is currently showing
 */
Kubrick.prototype.setScene = function(){
	var i, len = this.scenes.length, curStage, nextStage, modifier, j, scene, k, l, actor, props, prop, value;
	for (i = 0; i < len; i++){
		if (this.scrollTop >= this.scenes[i].start && this.scrollTop <= this.scenes[i].end){
			if (i == this.currentScene) break;

			curStage = this.currentScene > -1 ? this.scenes[this.currentScene].stage : null;
			nextStage = this.scenes[i].stage;

			if (curStage != nextStage){
				if (curStage){
					this.scenes[this.currentScene].stage.style.display = 'none';
				}
				if (nextStage){
					this.scenes[i].stage.style.display = 'block';
				}
			}

			modifier = i - this.currentScene > 0 ? 1 : -1;

			for (j = this.currentScene; ; j += modifier){
				if (j == i) break;
				scene = this.scenes[j];
				if (!scene || !scene.actors || !scene.actors.length) continue;
				for (k = 0; k < scene.actors.length; k++){
					actor = scene.actors[k];
					if (actor.callback){
						actor.callback.call(actor.element, modifier == -1 ? 0 : 100, scene.total);
					} else {
						props = {};
						for (l = 0; l < this.properties.length; l++){
							prop = this.properties[l];
							value = actor[prop];

							if (value){
								props[prop] = actor[prop][modifier == -1 ? 0 : 1];
							} else {
								props[prop] = this.getDefaultValue(prop);
							}
						}
						this.applyStyles(actor.element, props);
					}
				}
			}

			this.currentScene = i;
			break;
		}
	}
};

/**
 *
 */
Kubrick.prototype.action = function(){
	var current = this.scenes[this.currentScene];
	if (!current.actors || !current.actors.length) return;

	this.progress = this.scrollTop - current.start;
	var i, len = current.actors.length, j, prop, props = {};

	for (i = 0; i < len; i++){
		if (current.actors[i].callback){
			current.actors[i].callback.call(current.actors[i].element, (100 / current.total) * this.progress, current.total);
		} else {
			for (j = 0; j < this.properties.length; j++){
				prop = this.properties[j];

				props[prop] = this.calculateValue(prop, current.actors[i][prop]);
			}

			this.applyStyles(current.actors[i].element, props);
		}
	}
};

Kubrick.prototype.applyStyles = function(el, p){
	el.style[prefix + 'Transform'] = 'translate3d(' + p.translateX + 'px, ' + p.translateY + 'px, ' + p.translateZ + 'px) scale(' + p.scale + ') rotate(' + p.rotate + 'deg)';
	el.style.opacity = p.opacity;
};

/**
 *
 */
Kubrick.prototype.calculateValue = function(prop, value){
	if (!value){
		return this.getDefaultValue(prop);
	}

	var num = easing[this.scenes[this.currentScene].easing](
		this.progress,
		value[0],
		value[1] - value[0],
		this.scenes[this.currentScene].total
	);

	if (prop == 'translateX' || prop == 'translateY'){
		num = Math.round(num);
	}

	return num;
};

module.exports = Kubrick;
