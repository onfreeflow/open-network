# MAC Readme
--

## Zip Package:
```sh
$ tar --exclude='/usr/local/app/src'--exclude='/usr/local/app/package-lock.json' --exclude='/usr/local/app/tsconfig.json' -C overlay -czf ./core/overlay.tar.gz etc usr
```
format sd card w/ rpi imager

## Move core files
```sh
$ cp -R ./core/* /Volumes/NO\ NAME/*
```

## Start a VM
```sh
$ brew install qemu
$ sh rpi_vm.sh
```

## Inside Alpine
```sh
$ tar -zvxf ./core/overlay.tar.gz -C /
$ sh /etc/firstrun.sh
```

## Node Application Run
```sh
$ cd /usr/local/app/dist
$ npm start
```

