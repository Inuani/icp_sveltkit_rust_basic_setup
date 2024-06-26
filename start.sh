#!/bin/bash
# start.sh

npm i

source ~/.bashrc

bash -c 'dfx start --background --clean; dfx deploy'
# Ensure dfx is started
# dfx start --background --clean

# Optionally deploy your canisters if needed
# dfx deploy

# Start your npm development server
npm run dev -- --host 0.0.0.0
