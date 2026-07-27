---
inject: true
to: automation/series.json
after: "\"parts\": \\["
skip_if: "\"part\": <%= part %>,"
---
    { "part": <%= part %>, "label": "<%= label %>", "url": "TODO-fill-in-after-upload" },