#!/bin/bash
export PORT=5173
export BASE_PATH=/
cd "$(dirname "$0")"
exec corepack pnpm --filter @workspace/vedic-school run dev
