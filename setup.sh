#!/usr/bin/env sh

yarn install
yarn add rxjs@^5.0.1
yarn add  @ionic-native/core@^4.2.0
yarn add @angular/core@*
yarn add zone.js@^0.8.4
yarn add @ionic-native/in-app-browser
yarn add @ionic-native/deeplinks
ionic plugin add cordova-plugin-inappbrowser
ionic plugin add ionic-plugin-deeplinks --variable URL_SCHEME=recruitx --variable DEEPLINK_SCHEME=https --variable DEEPLINK_HOST=recruitx.com --save
yarn install
mkdir www/lib/ionic-native
cp ./node_modules/ionic-native/dist/ionic.native.min.js www/lib/ionic-native