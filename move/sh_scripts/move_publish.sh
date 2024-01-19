#!/bin/sh

set -e

echo "##### Publishing module #####"

# Profile is the account you used to execute transaction
# Run "aptos init" to create the profile, then get the profile name from .aptos/config.yaml
PROFILE=to_fill

ADDR=0x$(aptos config show-profiles --profile=$PROFILE | grep 'account' | sed -n 's/.*"account": \"\(.*\)\".*/\1/p')

aptos move publish \
	--assume-yes \
  --profile $PROFILE \
  --named-addresses aptogotchi=$ADDR
