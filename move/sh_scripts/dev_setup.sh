#!/bin/sh

set -e

echo "##### Installing aptos cli dependencies #####"
sudo apt-get update
sudo apt-get install libssl-dev

echo "##### Installing aptos cli #####"
if ! command -v aptos &>/dev/null; then
    echo "aptos could not be found"
    echo "installing it..."
    TARGET=Ubuntu-x86_64
    VERSION=2.3.0
    wget https://github.com/aptos-labs/aptos-core/releases/download/aptos-cli-v$VERSION/aptos-cli-$VERSION-$TARGET.zip
    sha=$(shasum -a 256 aptos-cli-$VERSION-$TARGET.zip | awk '{ print $1 }')
    [ "$sha" != "d9dc5c6ab3366f25d8547ca939f4a6be659f064c344a81f14631bc435ef6bafe" ] && echo "shasum mismatch" && exit 1
    unzip aptos-cli-$VERSION-$TARGET.zip
    chmod +x aptos
else
    echo "aptos already installed"
fi

echo "##### Info #####"
./aptos info
