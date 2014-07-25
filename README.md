# kubrick

`kubrick` helps you manage your site's parallax-y goodness in a clear and
concise manner.

## Using it

`kubrick` is currently just available on [npm][npm], you can use a tool like
[wrapup][wrapup] or [browserify][browserify] in your build process to make it
available in the browser.

```bash
$ npm install kubrick-js
```

## What's in a name?

As our company name would suggest, [Strangelove][strangelove] are fans of
Stanley Kubrick's work. Since a lot of parallax sites are actually a bit like a
movie, it's like you're the director of a film.

To stick to this synonym, `kubrick` features `scenes`, `stages` and of course
`actors`. More on this below.

## Specifying your animations

`kubrick` allows you to specify your animations in a regular javascript
array/object specification that looks a bit like this:

```js
require('kubrick-js')([
	{
		stage: '.mood',
		duration: '100%',
		actors: [
			{
				element: '.mission',
				translateY: '-25%',
				opacity: 0
			},
			{
				element: '.mission span',
				translateX: -40
			},
			{
				element: '.mission strong',
				translateX: 40
			}
		]
	}
]);
```

Each object in the array is a `scene`, each `scene` has a `stage` which is
displayed for the `duration` of the scene and all the `actors` animate over the
course of the `scenes`'s `duration`.

`kubrick` only supports animating performant css properties at the moment, which
means you are limited to: `translateX`, `translateY`, `translateZ`, `rotate`,
`scale` and `opacity`. The reason `kubrick` only supports these properties is
cause animating anything else has a high chance of causing the page to become
"janky".

## Choose your easing

`kubrick` also supports choosing which easing equation you want to use for any
`scene`. However, currently only two equations are built in: `linear` and
`easeInOutQuad`, of which the latter is the default. More easings will be added
later.

You can specify your easing by simply adding it to the definition of a `scene`,
through the `easing` key.

```js
[
  {
    stage: '.mood',
    duration: '100%',
    easing: 'linear',
    actors: []
  }
]
```

As an added extra, you can also access `kubrick`'s easing functions by
`require`ing them into your own code, like so:

```js
var easeInOutQuad = require('kubrick-js/easing/easeInOutQuad');
```

## Custom callbacks

Sometimes you might want to do something a bit exotic based on scroll position,
like animating a PNG sequence or so, or animating a property which is not
supported in kubrick's core. In cases like this, it's handy to use a custom
callback.

For example, to animate an element's width, we might do something that looks a
bit like this:

```js
[
  {
    stage: '.brand',
    duration: '100%',
    actors: [
      {
        element: '.logo-overlay',
        callback: function(progress, duration){
          this.style.width = easeInOutQuad((duration / 100) * progress, 0, 700, duration) + 'px';
        }
      }
    ]
  },
]
```

As you can see, the callback function gets passed 2 parameters - `progress` and
`duration`.

- `progress` is a percentage which indicates how far through the animation we
  are.
- `duration` is an integer which is the duration converted to pixels, based on
  window height

## Support for touch devices

Kubrick has (not very well tested) support for touch devices. It has been tested
on a few Android and iOS devices and it works well, but that's about it.

The way that this works is that native scrolling is disabled the distance you
have moved with your finger is instead used to do the animations.

## Inspired

`kubrick` was developed at [Strangelove][strangelove] after seeing Dave
Gamache's awesome [parallax demo][demo] and reading the excellent [accompanying
article][article] on Medium. Without his insights it would not exist today.
Thanks Dave!

[npm]: https://www.npmjs.org/
[wrapup]: https://github.com/mootools/wrapup
[browserify]: https://github.com/substack/node-browserify
[strangelove]: http://strangelove.nl/
[demo]: http://davegamache.com/parallax/
[article]: https://medium.com/@dhg/parallax-done-right-82ced812e61c
