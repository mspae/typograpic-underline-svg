const assign = require('lodash.assign')
const debounce = require('debounce')
const uuid = require('uuid')
const Underline = require('./underline')

function TypographicUnderline (el, options) {
  if (!el) {
    console.error('No element parameter defined')
  }

  const els = typeof el === 'string' ? document.querySelectorAll(el) : el

  if (!els.length) {
    console.error('No element found', el)
  }

  this.options = assign({}, {
    // [string auto|color value] the color the underline stroke should have,
    // if using auto the text color will be used
    strokeStyle: 'auto',
    // [string auto|int] if auto the position of the underline will equal the
    // line height, otherwise provide an integer representing the amount of
    // pixels from the top
    position: 'auto',
    // [string auto|int|null] the amount of whitespace between descenders and
    // the stroke, if auto is set it calculates the optimal masking, if int is
    // set that amount of masking is applied, if null is set no masking is
    // applied
    masking: 'auto',
    // [string auto|int] if auto the stroke is calculated, if it's an integer
    // that's the strokeWidth in pixels
    strokeWidth: 'auto',
    // [string selector|document element|null] if null, creates new container
    // element

    container: (options && options.container)
      ? ((typeof options.container === 'string')
        ? document.querySelectorAll(options.container)
        : options.container)
      : (() => {
        const container = document.createElement('div')
        container.className = 'underlines-container'
        //container.style.display = 'none'
        document.body.appendChild(container)
        return container
      })()
  }, options)

  this.underlines = []

  Array.from(els).map(el => {
    this.underlines.push(new Underline(el, this.options))
  })

  window.addEventListener('resize', debounce(this.resize.bind(this), 10))
}

TypographicUnderline.prototype.resize = function () {
  this.underlines.map(underline => underline.resize())
}

TypographicUnderline.prototype.update = function () {
  this.underlines.map(underline => underline.update())
}

TypographicUnderline.prototype.destroy = function () {
  this.underlines.map(underline => underline.destroy())
}

module.exports = TypographicUnderline
