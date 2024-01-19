#!/bin/sh

set -e

echo "##### Running move script to feed gotchi #####"

PROFILE=testnet-5
ADDR=0x$(aptos config show-profiles --profile=$PROFILE | grep 'account' | sed -n 's/.*"account": \"\(.*\)\".*/\1/p')

# Need to compile the package first
aptos move compile \
  --named-addresses aptogotchi=$ADDR

# Run the script
aptos move run-script \
  --profile $PROFILE \
  --compiled-script-path build/aptogotchi/bytecode_scripts/feed_gotchi.mv
