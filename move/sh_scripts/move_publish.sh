#!/bin/sh

set -e

echo "##### Publishing module #####"

# Profile is the account you used to execute transaction
# Run "aptos init" to create the profile, then get the profile name from .aptos/config.yaml
PROFILE=testnet-1

ADDR=0x$(aptos config show-profiles --profile=$PROFILE | grep 'account' | sed -n 's/.*"account": \"\(.*\)\".*/\1/p')

~/go/src/github.com/aptos-labs/aptos-core/target/debug/aptos move publish \
	--assume-yes \
  --profile $PROFILE \
  --named-addresses aptogotchi=$ADDR
