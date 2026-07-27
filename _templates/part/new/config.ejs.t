---
to: automation/part<%= part %>.json
---
<%
const series = h.series()
const n = Number(part)
const prior = series.parts.filter(p => p.part < n).sort((a, b) => a.part - b.part)

const description = [
  hook,
  '',
  `Part ${n} of The Money Machine, Decoded.`,
  '',
  'THE SERIES SO FAR:',
  ...prior.map(p => `Part ${p.part} - ${p.label}: ${p.url}`),
  `Part ${n} - You are here`,
  series.longform.funnel_line,
  ...series.footer_links,
  '',
  'No jargon. Just mechanisms.',
  'This is financial education, not financial advice.',
  '',
  `${titleHashtags.split(/\s+/).filter(Boolean).join(' ')} ${series.hashtags}`.trim(),
].join('\n')

const config = {
  file: `media/part${n}.mp4`,
  title: `${title} ${titleHashtags}`.trim(),
  description,
  tags: tags.split(',').map(t => t.trim()).filter(Boolean),
  publish_at: publishAt,
  engagement_comment: engagementComment,
}
-%>
<%- JSON.stringify(config, null, 2) %>
