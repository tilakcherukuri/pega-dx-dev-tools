#!/usr/bin/env bash
set -e

DIR=$1
MVER=$2
cp -R css/                         $DIR/css
cp -R assets/                      $DIR/assets
if [ "$MVER" = "2" ]; then
echo "*** Building MV2 Package ***"
cp platform/mv2/manifest.json      $DIR/
cp -R js/                          $DIR/js
cp -R *.js                         $DIR/
cp -R html/                        $DIR/html
else
echo "*** Building MV3 Package ***"
cp platform/mv3/manifest.json      $DIR/
cp -R js/                          $DIR/js
cp -R *.js                         $DIR/
cp -R html/                        $DIR/html
fi





