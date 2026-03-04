#!/bin/bash
# Fix hs-designsystem on AtlasUX Vercel so it builds the design system (not onboarding)
# Run FIRST: npx vercel login (log in with your AtlasUX/samantha account)
# Then run: ./scripts/fix-atlasux-hs-designsystem.sh

set -e

TOKEN=$(cat ~/Library/Application\ Support/com.vercel.cli/auth.json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "Error: No Vercel token. Run 'npx vercel login' and log in with your AtlasUX account."
  exit 1
fi

echo "Finding your Vercel teams..."
TEAMS=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.vercel.com/v2/teams")
echo "$TEAMS" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for t in d.get('teams', []):
    print('  -', t.get('slug'), '(' + t.get('name', '') + ')')
"
echo ""

# Try to find hs-designsystem project - try each team + personal
PROJECT_ID=""
ORG_ID=""
TEAM_ID_PARAM=""

# Get teams and try each (empty = personal account)
TEAM_IDS=$(echo "$TEAMS" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for t in d.get('teams', []):
    print(t.get('id'))
" 2>/dev/null)

for TID in $TEAM_IDS ""; do
  Q=""
  [ -n "$TID" ] && Q="?teamId=$TID"
  R=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.vercel.com/v9/projects/hs-designsystem$Q")
  if echo "$R" | grep -q '"id":"prj_'; then
    PROJECT_ID=$(echo "$R" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)
    ORG_ID=$(echo "$R" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('accountId',''))" 2>/dev/null)
    [ -n "$TID" ] && TEAM_ID_PARAM="?teamId=$TID"
    echo "Found hs-designsystem project"
    break
  fi
done

if [ -z "$PROJECT_ID" ]; then
  echo "Error: Could not find hs-designsystem project. Make sure you're logged into the AtlasUX account."
  exit 1
fi

echo ""
echo "Updating project settings..."
curl -s -X PATCH "https://api.vercel.com/v9/projects/hs-designsystem${TEAM_ID_PARAM}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rootDirectory": null,
    "installCommand": "cd design-system && npm install && cd app && npm install",
    "buildCommand": "cd design-system/app && npm run build",
    "outputDirectory": "design-system/app/dist",
    "framework": null
  }' | python3 -c "
import sys, json
d = json.load(sys.stdin)
if 'error' in d:
    print('Error:', d['error'].get('message', d))
    sys.exit(1)
print('✓ Settings updated')
" || exit 1

echo ""
echo "Linking to hs-designsystem and deploying..."
cd "$(dirname "$0")/.."
mkdir -p .vercel
echo '{"projectId":"'$PROJECT_ID'","orgId":"'$ORG_ID'","projectName":"hs-designsystem"}' > .vercel/project.json
npx vercel --prod --yes 2>&1

echo ""
echo "Done! Check https://hs-designsystem-olive.vercel.app in 1-2 minutes."
