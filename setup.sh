
#!/bin/sh
echo "Setting up environment"
echo "Checking .env"
if [ -f .env ];
then
export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
if ! command -v pm2
then
    echo "Installing pm2..."
    sudo npm i pm2 -g  && 
    sudo npm i kill-port -g  && 
    pm2 stop app.json &&
    echo "Stopping application."
    pm2 delete app.json
else
    echo "pm2 is installed skipping"
fi

if [! -d "node_modules"]
then
    echo "Installing packages"
    sudo npm install 
else
    echo "node modules folder exists, do you want to install re install?"
    read -p "Type (y) for install (n) for continue : " answer
    if [$answer == "y"];
    then
       echo "Installing packages"
       sudo npm install
    else
        echo "Going with existing node modules"
    fi
fi
echo "Starting application" &&
pm2 start app.json && 
echo "Watching logs" &&
pm2 logs 
else
    echo ".env is not exist"
    exit
fi
