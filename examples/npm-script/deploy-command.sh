#!/usr/bin/env bash
set -euo pipefail

archive_file_path="${1:-./dist/release.zip}"

curl -X POST "$REMOTE_DEPLOYMENT_URL/deploy" \
  -H "x-deployment-key: $REMOTE_DEPLOYMENT_KEY" \
  -F "path=$REMOTE_DEPLOYMENT_PATH" \
  -F "file=@${archive_file_path}"
