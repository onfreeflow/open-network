#!/bin/sh

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Define marker file location
LOG_FILE="/var/log/ezcharge"
MARKER_PATH="/var/lib/ezcharge/"
MARKER_FILE=$MARKER_PATH"firstrun-done"
MARKER_FILE_2=$MARKER_PATH"setup-complete"

# Log everything to /tmp/firstrun.log
exec 3>>$LOG_FILE 2>&1

set -x  # Enable debugging output
set -e # Error if returns anything other than 0

logAndDisplay() {
    local level="$1"
    local message="$2"
    local color=""

    case "$level" in
        OK) color="$GREEN";;
        ERROR) color="$RED";;
        WARN|INFO|DEBUG) color="$BLUE";;
        *) color="$NC";; # Default: No color
    esac

    printf "%s[%s]%s - %s\n" "$color" "$level" "$NC" "$message" >> /var/log/ezcharge
    printf "%s[%s]%s - %s\n" "$color" "$level" "$NC" "$message"
}
copyAndLog() {
    local source="$1";
    local destination="$2";
    local step="$3";

    logAndDisplay INFO "Copying $source..."
    if cp "$source" "$destination"; then
        logAndDisplay OK "Step $step - $source copied successfully to $destination .";
    else
        logAndDisplay ERROR "Step $step - Error: Failed to copy $description from $source to $destination.";
        return 1 # Return a non-zero exit code to indicate failure
    fi
    return 0
}

logAndDisplay INFO "Starting first run!"

# Check if the setup has already been completed
if [ -f "$MARKER_FILE" ]; then
  logAndDisplay INFO "...skiping first run setup";
  if [ -f "$MARKER_FILE_2" ]; then
    logAndDisplay INFO  "Normal boot operations commencing";
    cd /usr/local/app;
    npm start;
  else

    rc-update add wpa_supplicant default
    rc-update add networking default

    ifdown wlan0
    sleep 2 # Give it a moment to go down
    ifup wlan0

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
    touch "$MARKER_FILE_2";
    
    reboot;
  fi
else

  logAndDisplay INFO "Running first boot setup...";
  if apk update; then
    logAndDisplay OK "Step 1 - APK update complete";
  else
    logAndDisplay ERROR "Step 1 - APK update failed";
  fi

  if apk add wpa_supplicant wget openrc; then
    logAndDisplay OK "Step 2 - APK ADD wpa_supplicant wget and openrc complete";
  else
    logAndDisplay ERROR "Step 2 - Error: Failed to install packages";
  fi

  if rc-update add wpa_supplicant default; then
      logAndDisplay OK "Step 3 - Added wpa_supplicant to default runlevel";
  else
      logAndDisplay ERROR "Step 3 - Failed to add wpa_supplicant to default runlevel";
  fi

  if rc-update add networking default; then
      logAndDisplay OK "Step 4 - Added networking to default runlevel";
  else
      logAndDisplay ERROR "Step 4 - Failed to add networking to default runlevel";
  fi

  logAndDisplay INFO "Restarting network interface...";
  if ifdown wlan0; then
    sleep 2;
    if ifup wlan0; then
      logAndDisplay OK "Step 5 - wlan0 restarted successfully";
    else
      logAndDisplay ERROR "Step 5 - Error: Failed to bring up wlan0!";
    fi
  else
    logAndDisplay ERROR "Step 5 - Error: Failed to bring down wlan0!";
  fi
  sleep 2;

  logAndDisplay INFO "Starting 'setup-alpine'...";

  {
    echo "y"
    echo "y"
    echo ""
  } | setup-alpine -e -f /etc/answerfile;
  
  logAndDisplay OK "Step 6 - setup-alpine complete";
  
  sleep 2;

  copyAndLog /etc/firstrun.sh /etc/local.d/firstrun.start "7";
  copyAndLog /media/mmcblk0/cmdline.txt /boot/ "8";
  copyAndLog /media/mmcblk0/config.txt /boot/ "9";

  # Use /var/lib for marker files
  if mkdir -p $MARKER_PATH; then
    logAndDisplay OK "Step 10 - Created marker directory";
  else
    logAndDisplay ERROR "Step 10 - Failed to create marker directory";
  fi
  
  if touch "$MARKER_FILE"; then
    logAndDisplay OK "Step 11 - Created marker file";
  else
    logAndDisplay ERROR "Step 11 - Failed to create marker file";
  fi

  logAndDisplay OK "Alpine first run complete, rebooting...";

  #reboot
fi

exec 3>&-