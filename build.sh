#!/bin/bash
# echo "newuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
# useradd -m -p encryptedPassword newuser
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get install -y gcc g++ make python python-pip wget build-essential curl file git golang-go nodejs
# su - newuser -c 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"'
# su - newuser -c "/usr/local/bin/brew install node"
# su - newuser -c "/usr/local/bin/brew install go@1.10"
# wget -O /tmp/go1.10.2.linux-amd64.tar.gz https://dl.google.com/go/go1.10.2.linux-amd64.tar.gz
# tar -xzf /tmp/go1.10.2.linux-amd64.tar.gz
# mv ./go /usr/local/
export GOPATH=/root/go
/usr/lib/go/bin/go get google.golang.org/appengine
/usr/lib/go/bin/go get cloud.google.com/go/datastore
/usr/lib/go/bin/go get google.golang.org/api/cloudkms/v1
/usr/lib/go/bin/go get google.golang.org/appengine/log
/usr/lib/go/bin/go get golang.org/x/crypto/bcrypt

git clone https://github.com/BaReinhard/gamify-halloween
mkdir -p /root/go/src/github.com/bareinhard/gamify-halloween
cp -R gamify-halloween/* /root/go/src/github.com/bareinhard/gamify-halloween/
cd frontend
npm install
npm run build && rm -Rf ../server/static && cp -R build ../server/static
cd ..
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