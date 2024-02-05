#!/bin/sh

set -e

echo "##### Running tests #####"

~/go/src/github.com/aptos-labs/aptos-core/target/debug/aptos move test \
  --package-dir move \
  --dev
