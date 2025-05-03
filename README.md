# pdisplay
## Deskription
A simple CLI tool created with node.js that imitates the behaviour of other tools like lsof or ps, it is more focused on wireless connections ans port identification for each running service.

## Perquisites 
**NOTE:** If you have the **latest** node version on your local machine you can ignore the next prequisite.

- Docker *enabled* and *started*
```bash
$ sudo pacman -S docker
$ sudo systemctl enable docker
$ sudo systemctl start docker
```
## Output 

![Output]()

## Installation 
Simply clone this repo 
```bash
$ git clone https://github.com/ignorant05/pdisplay.git
```

## Usage
If you have node already on your local machine then just jump into it: 
```bash
$ pdisplay
```

However if you are using docker, then: 
```bash
$ cd pdisplay
$ sudo docker run pdisplay
```
Optionally you can add flags and specify ports, but i don't find it necessary here.
