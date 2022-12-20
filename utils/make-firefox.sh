#!/usr/bin/env bash

set -e

echo "*** PegaDXDT.firefox: Creating web store package"

BLDIR=dist/build
DIR="$BLDIR"/PegaDXDT.firefox
rm -rf $DIR
mkdir -p $DIR

echo "*** PegaDXDT.firefox: Copying common files"
bash ./utils/copy-common-files.sh  $DIR 2


echo "*** PegaDXDT.firefox: Creating xpi package..."

7z a -tzip -mx9 dist/build/$(basename $DIR).xpi ./$DIR/html  ./$DIR/css ./$DIR/*.* ./$DIR/js  ./$DIR/assets

echo "*** PegaDXDT.firefox: Package done ***"