#!/bin/sh

# Only deploy when merged to master
 if [ "$TRAVIS_BRANCH" != "master" ]
 then
   exit 0

 elif [ "$TRAVIS_PULL_REQUEST" != "false" ]
 then
   exit 0
 fi

# Fail fast
set -e

# Build
gulp

# Deploy
cd www

git init
git checkout -b gh-pages
git config --global user.email "johnny@pesola.eu"
git config --global user.name "Travis"

git remote add deploy "https://$GH_USERNAME:$GH_TOKEN@github.com/johnnypesola/1DV42E-practical-ionic.git"

git add -A

git commit -am "Deploy of build #$TRAVIS_BUILD_NUMBER of commit $TRAVIS_COMMIT"
echo "Deploying..."
git push deploy gh-pages --force > /dev/null 2>&1
echo "End of deploy"