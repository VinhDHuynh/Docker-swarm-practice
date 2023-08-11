#!/bin/bash

# Need to copy ssh key to other vms if you want to use this
# List of VM IP addresses
vms=("192.168.0.8" "192.168.0.13" "192.168.0.14")

while true; do
    for vm in "${vms[@]}"; do
        echo "Running 'docker ps' on VM: $vm"
        #change 192 to beginning of your subnet
        ssh root@$vm 'docker ps | grep 192'
    done
    sleep 3
done