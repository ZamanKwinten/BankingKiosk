#!/bin/sh

rm -rf target


rootDir=$(pwd)

cd $rootDir/java/bank.web
mvn clean package

cd $rootDir/javascript/bank.client
npm run build
cd $rootDir

mkdir $rootDir/target
mkdir $rootDir/target/server
mv $rootDir/java/bank.web/target/*.jar target/server
mv $rootDir/java/bank.web/target/lib/*.jar target/server
mv $rootDir/javascript/bank.client/build target/static

cp $rootDir/launch.sh $rootDir/target/launch.sh
chmod 755 $rootDir/target/launch.sh
