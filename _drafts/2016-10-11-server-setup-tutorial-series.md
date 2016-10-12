---
layout: post

guid: 3

categories: [Server]
date: 2016-10-11 22:05:00 UTC
title: Server Setup Tutorial Series
author: dmytro
tags: [] # TODO
image: server-setup-tutorial-series.png
---


Quite a while ago, I was unwillingly pushed into the world of Linux servers. 
I was developing a simple web app on .NET Core and was hosting it on Azure until... I got my first bill.
It was $50 per web app per month and it made me think.
Simple mathematical computations have shown that my web app barely generates 2% of what I am spending on hosting only.
Well, I decided to take a risk and attempt to serve a website from a VPS.
I not only succeeded, but rather was impressed by how much one can build on a $5 Ubuntu instance using Open Source solutions only.

![Cute ASCII fun](/assets/images/posts/server-setup-tutorial-series.png){:class="img-responsive"}

Now, that I have some experience with Linux server administration, I decided to share my knowledge.
I have decided to re-setup my server from scratch (clean install, if you will) and I will post tutorial-like articles as I go.
If I have piqued your interest, dear reader, welcome to my blog!

**Disclaimer**:
*I will do my best to keep these posts as simple as possible, but yet interesting and useful. However, I assume at least a little understanding of Linux. I assume the reader is able to SSH to the machine, make a directory, move, copy, remove, create, edit and view a file, etc. Anyway, if you find yourself struggling, please, let me know in the comments to the post. I will do my best to help you.*

Here is the approximate list of topic covered by the series:
* Basic server setup
* *NGINX* setup and serving a plain HTML page
* *NodeJS* web app setup
* *Supervisor* setup
* *PostgreSQL* database setup
* *MySQL* and *PHPMyAdmin* setup
* *.NET Core* web app setup
* *Java Spring* web app and *Tomcat* setup
* Uptime monitor setup
* System monitor setup
* *GitLab* setup
* *Minecraft* server setup
* Mail server setup
* *Jekyll* blog setup
* *WordPress* setup

I would also like to write about *Docker*, but at the time of this writing, I am not an expert in the area of containerization.
I am actively learning this technology, though.
So, hopefully, at some point I will add *Docker* to the list.
