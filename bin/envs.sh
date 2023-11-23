#!/bin/sh

cp ./frontend/.env.example ./frontend/.env.production

REPLACED=$(sed "/^VITE_CLIENT_ID/s/'[^']*'/'$VITE_CLIENT_ID'/g" .env.production | sed "/^VITE_API_KEY/s/'[^']*'/'$VITE_API_KEY'/g" )

echo "$REPLACED" > ./frontend/.env.production
