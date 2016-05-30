const Line = require('./line')
const baseline = require('font-baseline')
const detectZoom = require('detect-zoom')

/** receives text, splits at spaces
 returns an array of words */
function wrapWords (text) {
  const wordArr = text.split(/\s/).filter(Boolean)
  let result = []
  wordArr.map(word => {
    const node = document.createElement('span')
    const text = document.createTextNode(`${word}`)
    node.appendChild(text)
    result.push(node)
  })
  return result
}

/** receives an array of wordEls,
 calculates the lines based on the y offset,
 returns an array of line objects */
function calculateLines (wordEls) {
  let result = []
  let previousTop = wordEls[0].getBoundingClientRect().top
  let lineBegin = wordEls[0].getBoundingClientRect().left
  let line = []

  wordEls.forEach((word, i) => {
    const thisTop = word.getBoundingClientRect().top
    const thisEnd = word.getBoundingClientRect().right
    const nextWord = wordEls[i + 1]

    line.push(word)

    // next word is next line, or no nextWord, add line
    if (!nextWord || thisTop < nextWord.getBoundingClientRect().top) {
      result.push({
        begin: lineBegin,
        width: thisEnd - lineBegin,
        height: word.getBoundingClientRect().height,
        text: line,
        container: word.parentNode
      })

      // if there is a nextWord, initialise a new line
      if (nextWord) {
        lineBegin = nextWord.getBoundingClientRect().left
        line = []
      }
    }
  })
  return result
}




function Underline (el, options) {
  this.el = el
  this.options = options
  this.lines = []
  this.style = window.getComputedStyle(el)

  this.update()
}

/** update text in element */
Underline.prototype.update = function () {
  const text = this.el.textContent

  const words = wrapWords(text)
  this.el.innerHTML = ''
  words.map(word => {
    this.el.appendChild(word)
    this.el.appendChild(document.createTextNode(' '))
  })

  this.lines = calculateLines(words).map(line => {
    return new Line(line, this.options, this.style)
  })
}


module.exports = Underline
