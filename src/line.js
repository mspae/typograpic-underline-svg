const uuid = require('uuid')

function addMask(line, options, style, id) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const textPos = line.height
  const masking = 2
  const text = line.text.map(el => el.textContent).join(' ')


  console.log(line)
  const svgCode = `
    <defs>
    <mask id="mask-${id}"  maskContentUnits="objectBoundingBox">
      <text
        width="${line.width}"
        textLength="${line.width}"
        style="stroke-width: ${masking};stroke: #000000;fill: #000000;font-weight: ${style.fontWeight};font-family: ${style.fontFamily};letter-spacing: ${style.letterSpacing};word-spacing: ${style.wordSpacing};font-style: ${style.fontStyle};font-size: ${style.fontSize};">
        ${text}
      </text>
    </mask>
    </defs>
    `

  el.setAttribute('class', 'svg-underline')
  el.setAttribute('width', line.width)
  el.setAttribute('height', 100)
  el.innerHTML = svgCode
  el.id = id

  options.container.appendChild(el)
}

function wrapLine(line, options, id) {
  const parentNode = line.text[0].parentNode
  const lineNode = document.createElement('span')
  lineNode.innerHTML = line.text.map(el => el.textContent).join(' ')

  const underlineNode = document.createElement('div')
  underlineNode.className = 'underline-element'
  underlineNode.setAttribute('style', `-webkit-mask: url(#mask-${id}); mask: url(#mask-${id});`)

  lineNode.appendChild(underlineNode)

  line.text.map(word => parentNode.removeChild(word))

  parentNode.appendChild(lineNode)
}

function Line (line, options, style) {
  const id = uuid.v4()
  this.mask = addMask(line, options, style, id)
  this.underlined = wrapLine(line, options, id)

  return this
}

module.exports = Line
