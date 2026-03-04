#!/bin/bash
# Set hsp-onboarding Root Directory to HSP-Onboarding so it builds correctly.
# Run: ./scripts/fix-hsp-onboarding-root.sh

set -e

TOKEN=$(cat ~/Library/Application\ Support/com.vercel.cli/auth.json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "Error: No Vercel token. Run 'npx vercel login' first."
  exit 1
fi

# Get team ID for samantha-atlasuxcoms-projects (or use empty for personal)
TEAM_SLUG="samantha-atlasuxcoms-projects"
TEAM_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.vercel.com/v2/teams" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for t in d.get('teams', []):
    if t.get('slug') == 'samantha-atlasuxcoms-projects':
        print(t.get('id', ''))
        break
" 2>/dev/null)

TEAM_PARAM=""
[ -n "$TEAM_ID" ] && TEAM_PARAM="?teamId=$TEAM_ID"

echo "Updating hsp-onboarding project: Root Directory → HSP-Onboarding"
RESP=$(curl -s -X PATCH "https://api.vercel.com/v9/projects/hsp-onboarding${TEAM_PARAM}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rootDirectory": "HSP-Onboarding"}')

if echo "$RESP" | grep -q '"error"'; then
  echo "Error:" $(echo "$RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('error',{}).get('message', d))" 2>/dev/null)
  exit 1
fi

echo "✓ hsp-onboarding Root Directory set to HSP-Onboarding"
echo "  Next deploy will build from the correct folder."
