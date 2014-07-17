# kubrick

`kubrick` helps you manage your site's parallax-y goodness in a clear and
concise manner.

## Using it

`kubrick` is currently just available on [npm][npm], you can use a tool like
[wrapup][wrapup] or [browserify][browserify] in your build process to make it
available in the browser.

## What's in a name?

As our company name would suggest, [Strangelove][strangelove] are fans of
Stanley Kubrick's work. Since a lot of parallax sites are actually a bit like a
movie, it's like you're the director of a film.

To stick to this synonym, `kubrick` features `scenes`, `stages` and of course
`actors`. More on this below.

## Specifying your animations

`kubrick` allows you to specify your animations in a regular javascript
array/object specification that looks a bit like this:

```json
[
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
]
```

Each object in the array is a `scene`, each `scene` has a `stage` which is
displayed for the `duration` of the scene and all the `actors` animate over the
course of the `scenes`'s `duration`.

`kubrick` only supports animating performant css properties at the moment, which
means you are limited to: `translateX`, `translateY`, `translateZ`, `rotate`,
`scale` and `opacity`. The reason `kubrick` only supports these properties is
cause animating anything else has a high chance of causing the page to become
"janky".

## Support for touch devices

Kubrick has (not very well tested) support for touch devices. It has been tested
on a few Android and iOS devices and it works well, but that's about it.

The way that this works is that native scrolling is disabled the distance you
have moved with your finger is instead used to do the animations.

[npm]: https://www.npmjs.org/
[strangelove]: http://strangelove.nl/
