#!/bin/sh

set -e

echo "##### Publishing module #####"

# Profile is the account you used to execute transaction
# Run "aptos init" to create the profile, then get the profile name from .aptos/config.yaml
PROFILE=randomnet-3

ADDR=0x$(aptos config show-profiles --profile=$PROFILE | grep 'account' | sed -n 's/.*"account": \"\(.*\)\".*/\1/p')

# You need to checkout to randomnet branch in aptos-core and build the aptos cli manually
# This is a temporary solution until we have a stable release randomnet cli
~/go/src/github.com/aptos-labs/aptos-core/target/debug/aptos move publish \
	--assume-yes \
  --profile $PROFILE \
  --named-addresses aptogotchi=$ADDR
