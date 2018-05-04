#!/usr/bin/env sh
ionic prepare && ionic resources
ionic plugin add cordova-plugin-inappbrowser
ionic plugin add ionic-plugin-deeplinks --variable URL_SCHEME=recruitx --variable DEEPLINK_SCHEME=https --variable DEEPLINK_HOST=recruitx.com --save
ionic plugin add cordova-plugin-android-permissions
mkdir www/lib/ionic-native
cp ./node_modules/ionic-native/dist/ionic.native.min.js www/lib/ionic-native/