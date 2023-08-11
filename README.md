# Docker-swarm-practice
This project is used to show how sessions are maintained between containers and how containers are ochestrated in Docker Swarm.

First have three different computers ready with docker and docker-compose installed. Note that this guide will assume that these computers are in the same network. To create the manager node, run the following commands:
```
docker swarm init --advertise-addr <MANAGER-IP>
docker swarm join-token worker
```
Take the output from `docker swarm join-token worker` and run that command on your two other computers, which will be your worker nodes. It should look like this:
```
docker swarm join \
--token SWMTKN-1-49nj1cmql0jkz5s954yi3oex3nedyz0fb0xx14ie39trti4wxv-8vxv8rssmk743ojnwacrr2e7c \
192.168.99.100:2377
```

On the manager node, open ports 2377, 7946, 5001 as tcp and ports 7946, 4789 as udp.
On the worker nodes, open ports 7946 as tcp and 7946, 4789 as udp.

Next a local image registry needs to be created on the manager to share the images. Run `docker service create --name registry --publish published=5001,target=5000 registry:2`
on the manager to create a local registry on port 5001.

Next build the images to be used and put them in the registry on the manager. Run `cd ./front-end/front-end && docker build -t front-end:1.0.2 .` to build the front-end and `cd ./back-end && docker build -t back-end:.07` to build the back-end.

Run `docker image ls` to find the image id of the front-end and back-end. With those ids, run the following commands to put the images in the local registry: 
```
docker tag <FRONT-END-IMAGE-ID> 127.0.0.1:5001/front-end:1.0.2
docker tag <BACK-END-IMAGE-ID> 127.0.0.1:5001/back-end:0.7
docker push 127.0.0.1:5001/front-end:1.0.2
docker push 127.0.0.1:5001/back-end:0.7
```

We need to fetch these images on our worker nodes. Run `sudo vi /etc/docker/daemon.json` and add the following to the file:
```
{
  "insecure-registries": ["<MANAGER-IP>:5001"]
}

Restart docker with `sudo systemctl restart docker` after updating the file.
```

Finally, to start the stack and scale to 3 nodes, run the following command on your manager node in the top level directory:

```
docker stack deploy --compose-file docker-compose.yml swarmtest
docker service scale swarmtest_front-end=3
docker service scale swarmtest_back-end=3
```

To see the website go to `http://<MANAGER-IP>` in your browser. Wait about 10 seconds and refresh the page. Not how the ips of the front-end and back-ends change.
