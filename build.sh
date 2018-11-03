#!/bin/bash

apt-get install -y python python-pip wget
wget -O /tmp/go1.10.2.linux-amd64.tar.gz https://dl.google.com/go/go1.10.2.linux-amd64.tar.gz
tar -xvzf /tmp/go1.10.2.linux-amd64.tar.gz
mv ./go /usr/local/
/usr/local/go/bin/go get google.golang.org/appengine
/usr/local/go/bin/go get cloud.google.com/go/datastore
/usr/local/go/bin/go get google.golang.org/api/cloudkms/v1
/usr/local/go/bin/go get google.golang.org/appengine/log
/usr/local/go/bin/go get golang.org/x/crypto/bcrypt

ls /root/go/src
git clone https://github.com/BaReinhard/gamify-halloween
mkdir -p /root/go/src/github.com/bareinhard/gamify-halloween
cp -R gamify-halloween/* /root/go/src/github.com/bareinhard/gamify-halloween/
SHA=$(git rev-parse --short origin/$CIRCLE_BRANCH)
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

gcloud auth activate-service-account --key-file=./server/key.json
gcloud --quiet config set project $PROJECT_ID
gcloud --quiet config set account $ACCOUNT

echo y | gcloud app deploy ./server/app.yaml \
	--project=$PROJECT_ID \
	--account=$ACCOUNT \
	--version=$SHA 