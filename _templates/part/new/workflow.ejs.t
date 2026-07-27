---
to: "<%= workflow ? `.github/workflows/upload-part${part}.yml` : null %>"
---
name: Upload Part <%= part %>

on:
  workflow_dispatch:
    inputs:
      mode:
        description: "upload = upload & schedule publish; comment = post engagement comment"
        type: choice
        options: [upload, comment]
        default: upload
      video_id:
        description: "Video ID (comment mode only)"
        required: false
        default: ""

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r automation/requirements.txt
      - name: Upload video (scheduled publish)
        if: ${{ inputs.mode == 'upload' }}
        run: python automation/upload_video.py --config automation/part<%= part %>.json
        env:
          YT_CLIENT_ID: ${{ secrets.new1 }}
          YT_CLIENT_SECRET: ${{ secrets.new2 }}
          YT_REFRESH_TOKEN: ${{ secrets.new3 }}
      - name: Post engagement comment
        if: ${{ inputs.mode == 'comment' }}
        run: python automation/upload_video.py --config automation/part<%= part %>.json --comment "${{ inputs.video_id }}"
        env:
          YT_CLIENT_ID: ${{ secrets.new1 }}
          YT_CLIENT_SECRET: ${{ secrets.new2 }}
          YT_REFRESH_TOKEN: ${{ secrets.new3 }}
