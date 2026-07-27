const fs = require('fs')
const path = require('path')

const seriesPath = path.join(__dirname, 'automation', 'series.json')

module.exports = {
  templates: path.join(__dirname, '_templates'),
  helpers: {
    // The series index is the single source of truth for the description link block.
    series: () => JSON.parse(fs.readFileSync(seriesPath, 'utf8')),
  },
}
