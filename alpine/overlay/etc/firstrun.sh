#!/bin/sh

# Log everything to /tmp/firstrun.log
# exec > /tmp/firstrun.log 2>&1
exec > /dev/tty0 2>&1

set -x  # Enable debugging output

echo "Starting first run!"

# Define marker file location
MARKER_FILE="/mnt/tmp/firstrun-done"
MARKER_FILE_2="/mnt/tmp/setup-complete"

# Check if the setup has already been completed
if [ -f "$MARKER_FILE" ]; then
  echo "...skiping first run setup"
  if [ -f "$MARKER_FILE_2" ]; then
    echo "Normal boot operations commencing"
  else 
    # Step 3: Update and install necessary packages after network connection is established
    apk update && \
    apk upgrade && \
    apk add --no-cache \
        alpine-sdk \
        build-base \
        chrony \
        curl \
        git \
        icu-libs \
        libusb \
        linux-headers \
        make \
        nodejs \
        openrc \
        raspberrypi \
        screen \
        sudo \
        tmux \
        tzdata \
        udev \
        wireless-tools \
        wiringpi

    # Step 4: Fetch the secret password from the API and create the user with that password
    # secret=$(curl --silent --cert client-cert.pem \
    #               --key client-key.pem \
    #               --cacert nginx.cert \
    #               -d "serial_number=1-2024-b1-000001" \
    #               https://ocpp.ezcharge.com/get-evse-secret) || secret="Abcd1234!"
    # adduser -D -s /bin/sh evse-user
    # echo "evse-user:${secret}" | chpasswd

    # # Step 5: Configure sudoers for evse-user
    # echo "evse-user ALL=(ALL) NOPASSWD: /bin/journalctl, /usr/bin/tail, /bin/grep, /bin/cat, /usr/bin/less" > /etc/sudoers.d/evse-user
    # chmod 440 /etc/sudoers.d/evse-user

    # # Step 6: Configure SSH for evse-user and create SSH authorized_keys file if missing
    # mkdir -p /home/evse-user/.ssh
    # touch /home/evse-user/.ssh/authorized_keys
    # chown -R evse-user:evse-user /home/evse-user/.ssh
    # chmod 700 /home/evse-user/.ssh
    # chmod 600 /home/evse-user/.ssh/authorized_keys

    # # Update SSH configuration
    # echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config
    # echo "PermitRootLogin no" >> /etc/ssh/sshd_config
    # echo "AllowUsers evse-user" >> /etc/ssh/sshd_config
    # echo "PermitUserEnvironment no" >> /etc/ssh/sshd_config

    # # Step 7: Generate SSH host keys if they don't exist
    # ssh-keygen -A
    touch "$MARKER_FILE_2"
  fi
else
  apk update
  apk add wpa_supplicant wget

  chmod 600 /etc/wpa_supplicant/wpa_supplicant.conf;
  wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf;
  sleep 5
  ifdown wlan0
  sleep 5
  ifup wlan0
  sleep 5
  echo "Running first boot setup...";

  {
    echo "y"
    echo ""
  } | setup-alpine -e -f /etc/answerfile;

  sleep 5;

  cp /etc/firstrun.sh /mnt/etc/firstrun.sh
  cp /etc/wpa_supplicant/wpa_supplicant.conf /mnt/etc/wpa_supplicant/wpa_supplicant.conf
  cp /media/mmcblk0/cmdline.txt /mnt/boot/cmdline.txt
  cp /media/mmcblk0/config.txt /mnt/boot/config.txt

  echo "Alpine first run complete, rebooting..."
  
  touch "$MARKER_FILE"
  
  # reboot
fi