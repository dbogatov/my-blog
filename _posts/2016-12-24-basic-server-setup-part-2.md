---
layout: post

guid: 5

categories: [Server]
date: 2016-12-24 20:35:00 UTC
title: Basic Server Setup Part 2
author: dmytro
tags: [ssh, sudo, server]
image: basic-server-setup-part-2.jpg
---

Welcome to the second part of server setup tutorial.
In this post we will finish setting up a virtual Ubuntu 16.04 server on Digital Ocean.

![Sudo fun](/assets/images/posts/basic-server-setup-part-2.jpg){:class="img-responsive"}

In the previous part we did

* create a droplet (Linux instance)
* create a user with `sudo` privilages
* add SSH key for authentication and disable `root` login

In this part we will 

* configure a basic firewall
* set correct timezone
* create a `swap` file

along the way, I will explain why we do things and how we do things.

## Firewall

### Why do we need it?

The main reason to use a firewall is to secure your server.
Although firewall does not protect you from all kinds of attacks, it still prevents a large number of them.

The basic firewall we are about to configure will simply allow or deny certain connections on certain ports.
All devices on the network (and your server in particular) communicate with each other through *ports*.
Think of a port as a little window in the house (server) through which you can pass messages and some small stuff.
*Open port* means that the window is open and any tenant (program on the server) may use it.

Without a firewall, any program can listen to any port (ports lower than 1024 are restricted to `root` user).
Such configuration undermines the overall security of the server.
A malicious script (virus, botnet, malware) is therefore able to communicate with its command center.
Attackers are able to "ping" your server through different ports seeking for vulnerabilities and performing a DDoS attack.
Firewall mostly solves these problems.

### UFW

UFW (Uncomplicated Firewall) is a piece of software built on top of the `iptables`.
UFW is much more simple and user friendly, however.
For the sake of little demo, here is the sample command for `iptables`.

```
iptables -A INPUT -i eth1 -p tcp -s 192.168.1.0/24 --dport 80 -j DROP
```

Here is the similar command written for UFW.

```
ufw allow from 192.168.1.0 to any port 80
```

If you think that the former is more readable, feel free to skip this section.

### Setting up the firewall

First of all, install `ufw`. 
It may be already installed on your system.

```
sudo apt-get install ufw
```

Check the status of the firewall.

```
sudo ufw status verbose
```

It should be disabled (inactive). 
Before we activate it, let us create some rules.
First rules we will create are the *default* rules - they apply if there is no *more specific* rule.
General practice is to allow outbound connections and deny inbound ones.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

The first specific rule we have to have is an SSH (port 22) rule.
You are now connected through the SSH and if you do not explicitly allow the connection, you will lose SSH access to your server.
Do not worry though, Digital Ocean still lets you connect through the console in case the SSH is unavailable.

```
sudo ufw allow ssh
```

So far we can enable the firewall.

```
sudo ufw enable
```

Now, try to reconnect to your server, you should be able to do so.

### Further reading

Congratulations, you have a very secure firewall setup now.
You block almost all incoming connections.
Of course, you will need more flexible policies with time, so here is the quick list of what UFW can do.
This list is not exhaustive.

* Allow/deny connections to certain ports
* Allow/deny connections from certain addresses, ranges and networks
* Allow/deny connections to certain network interfaces (say, if you have multiple networks cards or virtual interfaces)

Here is the list of common ports you might want to keep open.

* **SSH** port 20
* **HTTP** port 80
* **HTTPS** port 443
* **FTP** port 21
* **SMPT** port 25
* **IMAP** port 143
* **rsync** port 873

Digital Ocean has a great [article](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands) on UFW.

## Configure timezones

### Why do we need it?

Many server operations highly depend on time and timestamps.
Each message in the system logs has a timestamp with it, most of the scheduled task determine whether to run depending on the time it ran last time, security certificates validation includes verifying the expiration date.
Matters get worse when two servers start talking to each other and while their time is unsynchronized.

In this section we will

* configure the server's timezone
* install a daemon which synchronizes time with dedicated time servers on each boot

### Setting up timezones

The following command will bring up the UI where you can select a timezone.
Please, select your **server's** timezone, **not** yours.

```
sudo dpkg-reconfigure tzdata
```

This command will install a daemon which synchronizes time.

```bash
sudo apt-get update
sudo apt-get install ntp
```

That's it. Daemon is installed, configured and will run on each boot.

## SWAP file

### Why do we need it?

Simply put, `swap` file is a place on your hard disk, which gets used as RAM when there is too little RAM available.
The system operates on RAM like there is no `swap` file, just the memory card capacity is increased.
So, in the system's view, RAM is *RAM on memory card* plus *the size of the swap file*.
This approach is useful when some of your apps request more RAM than you have on your memory card.
However, it is always better to upgrade RAM if the budget allows.

There are a few caveats though.

> Do not use SWAP file if you have enough RAM (or can purchases enough RAM).
> You hard disk is much slower than the RAM, so while you win in "RAM" size, you lose in "RAM" average read/write speed.

> As you might know, the number of requests to a RAM is incompatible to the number of requests to a hard disk.
> Be prepared that the space allocated for the SWAP file will get hundred times more requests than other regions on the disk.
> Therefore, the disk will run-out extremely quickly.
> In the case of SSD the issue is critical since they have very certain number of access times before they die.
> Digital Ocean does **not** recommend using SWAP files on their SSD machines.

If you still want to use SWAP file (and I think it is still useful despite its disadvantages), please, read on.

### Setting up SWAP file

These are the few commands you need to get SWAP working.

```bash

sudo fallocate -l 4G /swapfile # this will allocate 4Gb space for the file swapfile in the root directory
sudo chmod 600 /swapfile # very important - restrict users from seeing the content of the file
sudo mkswap /swapfile # tell system that this file is a SWAP file
sudo swapon /swapfile # let system start using the SWAP file

```

These commands enable SWAP file for the session.
If you want to enable SWAP file on boot, execute the following.

```
sudo sh -c 'echo "/swapfile none swap sw 0 0" >> /etc/fstab'
```

You are all set.
