#!/bin/sh

cp ./frontend/.env.example ./frontend/.env.production

REPLACED=$(sed "/^VITE_API_KEY/s/'[^']*'/'$VITE_API_KEY'/g" ./frontend/.env.production)

echo "$REPLACED" > ./frontend/.env.production
