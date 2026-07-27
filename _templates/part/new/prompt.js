// Prompts for `npm run new:part`. Defaults are derived from automation/series.json
// so the next part number and the series link block stay in sync automatically.
const path = require('path')
const series = require(path.join(__dirname, '..', '..', '..', 'automation', 'series.json'))

const nextPart = Math.max(...series.parts.map((p) => p.part)) + 1

module.exports = [
  {
    type: 'input',
    name: 'part',
    message: 'Part number',
    initial: String(nextPart),
  },
  {
    type: 'input',
    name: 'title',
    message: 'Title (without hashtags — "How to X Without Y" / "How Banks X Your Y" wins best)',
  },
  {
    type: 'input',
    name: 'label',
    message: 'Series-index label (short, e.g. "How to buy a car without interest (Ijara)")',
  },
  {
    type: 'input',
    name: 'titleHashtags',
    message: 'Title hashtags (2 max, e.g. "#ijara #islamicfinance")',
  },
  {
    type: 'input',
    name: 'hook',
    message: 'Description opener — the personal-stakes paradox, first 3 seconds of the cut',
  },
  {
    type: 'input',
    name: 'publishAt',
    message: 'publish_at (UTC ISO, e.g. 2026-07-28T10:15:00Z)',
  },
  {
    type: 'input',
    name: 'tags',
    message: 'Tags (comma separated, ~20)',
  },
  {
    type: 'input',
    name: 'engagementComment',
    message: 'Pinned engagement comment (ends in a question + 👇)',
  },
  {
    type: 'confirm',
    name: 'workflow',
    message: 'Also generate .github/workflows/upload-partN.yml?',
    initial: true,
  },
]
