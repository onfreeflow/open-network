#!/bin/sh

# Color codes
RED='\033[0;31m';
GREEN='\033[0;32m';
BLUE='\033[0;34m';
NC='\033[0m'; # No Color

# Define file locations
LOG_FILE="/var/log/ezcharge";
MARKER_PATH="/var/lib/ezcharge/";
MARKER_FILE=$MARKER_PATH"firstrun-done";
MARKER_FILE_2=$MARKER_PATH"setup-complete";

# Log everything to /tmp/firstrun.log
exec 3>>"$LOG_FILE" 2>&1;

# Enable debugging output
set -x;

# Error if returns anything other than 0
set -e;

# Level - $1
# Message - $2
logAndDisplay() {
    local color=""

    case "$1" in
        OK) color=$GREEN;;
        ERROR) color=$RED;;
        WARN|INFO|DEBUG) color=$BLUE;;
        *) color=$NC;;
    esac

    printf '%s[%s]%s - %s\n' "$color" "$1" "$NC" "$2"

    return $(("$1" == "ERROR" ? 1 : 0))
}

# $1 = source
# $2 = destination
# $3 = step number(string)
copyAndLog() {
  if !$3; then
    $3 = "N"
  fi
  logAndDisplay INFO "Copying $source..."
  if cp "$1" "$2"; then
      logAndDisplay OK "Step $3 - $1 copied successfully to $2 .";
      return 0
  else
      logAndDisplay ERROR "Step $3 - Error: Failed to copy $1 to $2.";
      return 1
  fi
}

logAndDisplay INFO "Starting first run file!"

# Check if the setup has already been completed
if [ -f "$MARKER_FILE" ]; then
  logAndDisplay INFO "...skiping first run setup";
  if [ -f "$MARKER_FILE_2" ]; then
    logAndDisplay INFO  "Normal boot operations commencing";
    cd /usr/local/app;
    npm start;
  else
    set -e
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
    
    # reboot;
  fi
else

  set -e;
  logAndDisplay INFO "Running first boot setup...";
  if apk update; then
    logAndDisplay OK "Step 1 - APK update complete";
  else
    logAndDisplay ERROR "Step 1 - APK update failed";
    return 1;
  fi

  if apk add wpa_supplicant wget openrc; then
    logAndDisplay OK "Step 2 - APK ADD wpa_supplicant wget and openrc complete";
  else
    logAndDisplay ERROR "Step 2 - Error: Failed to install packages";
    return 1;
  fi

  if chmod 600 /etc/wpa_supplicant/wpa_supplicant.conf; then
    logAndDisplay OK "Step X - Changing wpa_supplicant.conf permissions complete";
  else
    logAndDisplay ERROR "Step X - Changing wpa_supplicant.conf permissions failed";
    return 1;
  fi

  if wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf; then
    logAndDisplay OK "Step Y - WPA Supplicant successfully started with /etc/wpa_supplicant/wpa_supplicant.conf";
  else
    logAndDisplay ERROR "Step Y - WPA Supplicant failed to start";
  fi

  sleep 5;
  # ifdown wlan0
  # sleep 5
  # ifup wlan0
  # sleep 5
  # echo "Running first boot setup...";

  if ip link show wlan0 | grep -q "state UP"; then
    ifdown wlan0;
    logAndDisplay "wlan0 brought down successfully.";
  else
    logAndDisplay "wlan0 is not up; skipping ifdown.";
    return 1;
  fi

  sleep 2;

  if ifup wlan0; then
    echo "wlan0 brought up successfully.";
  else
    echo "Error: Failed to bring up wlan0!";
    return 1;
  fi

  logAndDisplay INFO "Starting 'setup-alpine'...";
  {
    echo "y"
    echo "y"
    echo ""
  } | setup-alpine -e -f /etc/answerfile;
  
  logAndDisplay OK "Step 6- setup-alpine complete";
  
  sleep 2;

  if rc-update add wpa_supplicant default; then
    logAndDisplay OK "Step 4 - Added wpa_supplicant to default runlevel";
  else
    logAndDisplay ERROR "Step 4 - Failed to add wpa_supplicant to default runlevel";
    return 1;
  fi
  
  if rc-update add networking default; then
    logAndDisplay OK "Step 5 - Added networking to default runlevel";
  else
    logAndDisplay ERROR "Step 5 - Failed to add networking to default runlevel";
    return 1;
  fi

  sleep 2;

  copyAndLog /etc/firstrun.sh /etc/local.d/secondrun.start "6";
  copyAndLog /media/mmcblk0/cmdline.txt /boot/ "7";
  copyAndLog /media/mmcblk0/config.txt /boot/ "8";

  # Use /var/lib for marker files
  if mkdir -p $MARKER_PATH; then
    logAndDisplay OK "Step 9 - Created marker directory";
  else
    logAndDisplay ERROR "Step 9 - Failed to create marker directory";
    return 1;
  fi
  
  if touch "$MARKER_FILE"; then
    logAndDisplay OK "Step 10 - Created marker file";
  else
    logAndDisplay ERROR "Step 10 - Failed to create marker file";
    return 1;
  fi

  logAndDisplay OK "Alpine first run complete, rebooting...";

  #reboot
fi

exec 3>&-