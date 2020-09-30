#!/bin/bash

while [ 1 ]; do
	echo "[ServerBoot.sh] "$(date)" Boot server" &>> /var/log/mip_server
	npm start --prefix /home/dyuste/marketingitplatform/ &>> /var/log/mip_server
	echo "[ServerBoot.sh] "$(date)" End of server execution" &>> /var/log/mip_server
	sleep 1;
done
