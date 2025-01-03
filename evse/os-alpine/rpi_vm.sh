qemu-system-aarch64 \
    -M raspi3b \
    -kernel /path/to/kernel8.img \
    -dtb /path/to/bcm2711-rpi-4-b.dtb \
    -drive file=/dev/disk2,if=sd,index=0,format=raw \
    -serial stdio \
    -display sdl \
    -device VGA,id=hdmi0,vgamem_mb=64 \
    -device VGA,id=shield,vgamem_mb=16,xres=320,yres=480 \
    -usb -device usb-mouse -device usb-kbd