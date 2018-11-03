#!/bin/bash

sudo apt-get install -y python python-pip
SHA=$(git rev-parse --short origin/$CIRCLe_BRANCH)
pip install jinja2
if [ "$CIRCLE_BRANCH" = "master" ];
then
	echo "Starting Production Build"
	export PROJECT_ID=heph-core
	export ACCOUNT=heph-core@appspot.gserviceaccount.com
	echo $PROD_KEY_FILE > ./server/key.json
elif [ "$CIRCLE_BRANCH" = "development" ];
then
	echo "Starting Development Build"
	export PROJECT_ID=heph-core-dev
	export ACCOUNT=heph-core-dev@appspot.gserviceaccount.com
	echo $DEV_KEY_FILE > ./server/key.json
else
	echo "Build Not Supported for this branch"
fi

python -c 'import os
import sys
import jinja2
sys.stdout.write(
	jinja2.Template(sys.stdin.read()
).render(env=os.environ))' < ./templates/app.jinja > ./server/app.yaml

sudo gcloud auth activate-service-account --key-file=./server/key.json
sudo gcloud --quiet config set project $PROJECT_ID

echo y | gcloud app deploy ./server/app.yaml \
	--project=$PROJECT_ID \
	--account=$ACCOUNT \
	--version=$SHA 