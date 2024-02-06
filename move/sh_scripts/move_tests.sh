#!/bin/sh

set -e

echo "##### Running tests #####"

# You need to checkout to randomnet branch in aptos-core and build the aptos cli manually
# This is a temporary solution until we have a stable release randomnet cli
~/go/src/github.com/aptos-labs/aptos-core/target/debug/aptos move test \
  --package-dir move \
  --dev
