#!/bin/bash
set -e

# Apache gets grumpy about PID files pre-existing
rm -f /usr/local/apache2/logs/httpd.pid

nohup Xvfb :1 -screen 0 1920x1080x24 -ac +extension GLX +render -noreset &

# vnc for debug
nohup x11vnc -display :1 -forever -shared -noxdamage -repeat -rfbport 5900 &

function set_right_user()
{
    #Set correct user role
    local user_id=${LOCAL_USER_ID}

    echo "Starting with UID : $user_id"
    if [ -z "$user_id" ]; then
        echo 'The value of LOCAL_USER_ID is not set, please set it before run this program by running `export LOCAL_USER_ID=`id -u $USER` `'
        exit;
    else
        usermod -u $user_id user;
    fi

}

set_right_user;

exec httpd -DFOREGROUND
