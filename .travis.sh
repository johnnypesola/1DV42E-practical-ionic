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

# Setup github pages repo
cd www

git init
git config --global user.email "johnny@pesola.eu"
git config --global user.name "Travis"

git remote add upstream "https://johnnypesola:$GITHUB_API_KEY@github.com/johnnypesola/1DV42E-practical-ionic.git"

git fetch upstream
git reset upstream/gh-pages

# Build
cd ..
gulp travis
cd www

# Commit and push to github pages repo
git add -A

git commit -am "Deploy of build #$TRAVIS_BUILD_NUMBER of commit $TRAVIS_COMMIT"
echo "Pushing to git.."
git push upstream -q HEAD:gh-pages --force > /dev/null 2>&1
echo "Push to git done"