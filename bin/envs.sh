#!/bin/sh

cp ./frontend/.env.example ./frontend/.env.production

REPLACED=$(sed "/^VITE_CLIENT_ID/s/'[^']*'/'$VITE_CLIENT_ID'/g" ./frontend/.env.production )

echo "$REPLACED" > ./frontend/.env.production
