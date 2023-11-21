#!/bin/sh

GOOGLE_CREDS=$(cat ./api/credentials.json | base64)

#export $(cat ./api/.env.local | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )

aws ssm put-parameter \
  --name "/TouchScores/GOOGLE_CREDS" \
  --type "SecureString" \
  --value ${GOOGLE_CREDS} \
  --overwrite