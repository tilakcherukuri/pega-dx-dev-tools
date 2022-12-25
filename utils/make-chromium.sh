#!/usr/bin/env bash
set -e

echo "*** PegaDXDT.chromium.mv3: Creating web store package"

DIR=dist/build/PegaDXDT.chromium.mv3
rm -rf $DIR
mkdir -p $DIR

echo "*** PegaDXDT.chromium.mv3: Copying common files"
bash ./utils/copy-common-files.sh  $DIR 

echo "*** PegaDXDT.chromium.mv3: Creating zip package..."
7z a -tzip -mx9 dist/build/PegaDXDT.chromium.mv3.zip ./$DIR/html  ./$DIR/css ./$DIR/*.* ./$DIR/js ./$DIR/assets


echo "*** PegaDXDT.chromium.mv3: Package done."



echo "*** PegaDXDT.chromium: Creating web store package ***"

DIR=dist/build/PegaDXDT.chromium
rm -rf $DIR
mkdir -p $DIR

echo "*** PegaDXDT.chromium: Copying common files ***"
bash ./utils/copy-common-files.sh  $DIR 2


echo "*** PegaDXDT.chromium: Creating zip package..."

7z a -tzip -mx9 dist/build/PegaDXDT.chromium.zip ./$DIR/html  ./$DIR/css ./$DIR/*.* ./$DIR/js  ./$DIR/assets


echo "*** PegaDXDT.chromium: Package done ***"