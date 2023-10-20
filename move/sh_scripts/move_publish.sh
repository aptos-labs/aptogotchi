#!/bin/sh

set -e

echo "##### Publishing module #####"

PROFILE=testnet-2
ADDR=0x$(aptos config show-profiles --profile=$PROFILE | grep 'account' | sed -n 's/.*"account": \"\(.*\)\".*/\1/p')

aptos move publish \
	--assume-yes \
  --profile $PROFILE \
  --named-addresses aptogotchi=$ADDR
