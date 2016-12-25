---
layout: post

guid: 4

categories: [Server]
date: 2016-10-12 22:05:00 UTC
title: Basic Server Setup Part 1
author: dmytro
tags: [ssh, sudo, server]
image: basic-server-setup-part-1.png
---

Welcome to the first tutorial in my series.
In this post we will setup a virtual Ubuntu 16.04 server on Digital Ocean.

![Sudo fun](/assets/images/posts/basic-server-setup-part-1.png){:class="img-responsive"}

In this part we will:

* create a droplet (Linux instance)
* create a user with `sudo` privilages
* add SSH key for authentication and disable `root` login

In the next part we will:

* configure a basic firewall
* set correct timezone
* create a `swap` file

along the way, I will explain how we do things and why we do things.

## Create a droplet

There is a number of VPS providers, DigitalOcean just happens to be my favorite.
They have amazingly user-friendly UI and, most valuable, wonderful support community and [tutorials](https://www.digitalocean.com/community/tutorials).

Here are the steps to create a droplet with DO:

* go and register to [DO](https://m.do.co/c/61c143d826cd) (yes, the link contains my referral code, hope you don't mind, you also will get a bonus)
* provide payment info (if necessary)
* go to *create droplet* menu
* choose *Ubuntu 16.04*
* pick any size
* pick a datacenter in NYC (looks like they roll out new features to that data center first)
* do not select any additional options (unless you are very confident that you know what they mean)
* choose a meaningful name (if you have a domain, which I encourage you to have, name a droplet as your FQDN, like `dbogatov.org`)

In a while, you will receive a message with the IP and `root` password for your newly created droplet.

## Connect to your droplet

In your unix terminal (or any other SSH client, like *putty* for Windows), enter the command:

```
ssh root@[YOUR_IP]
```

the system will probably ask you the following:

```
The authenticity of host 'YOUR_IP (YOUR_IP)' can't be established.
ECDSA key fingerprint is SHA256:WEIRD_SEQUENCE_OF_CHARACTERS_AND_NUMBERS.
Are you sure you want to continue connecting (yes/no)?
```

this is a security warning and you should treat it seriously.
What it says is *"Hey user, I am about to ask you a password and let you connect to some host. I cannot guarantee that this host is authentic (authentic means that it is what it claims to be), but here is its unique identifier (fingerprint). Shall I proceed?"*.
Specifically in this case you pretty much don't have a choice but to say *yes*.
The system will store this *fingerprint* and associate it with this IP.

**However**, if at some point system says *"Fingerprints do not match"*, you are in trouble and probably should think twice before saying *"Connect anyway"*.
In 99% cases, it would mean a Man-in-the-Middle attack.

For now, say *yes*.

The system will ask you for the password.
Use the one sent to you in DO email.
The system will immediately ask you to change the password.
Needless to say, pick a **secure** password.

Great, you are connected as `root` to your droplet, you should see something similar to this:

```
root@[DROPLET_NAME]:~# 
```

## Add a non-root sudo-privileged user

Although it might seem convenient to run everything as `root` as opposed to typing `sudo` every time, it is a very **bad** practice to do so.
Administrator account being separate from the user account is one of the most important advancements in a OS design.
Although it does not protect from all known threats, it largely mitigates the attacks.
`root` user (which is technically not even a user) is capable of doing **any** operation in the OS.
It can view any file (private keys, stored passwords), it can modify/remove any file (OS kernel files too), it can run any executable and so on.
Two immediate problems with that:

* legitimate user may accidentally damage the system (say, `rm -rf /*` instead of `rm -rf /tmp/*`)
* malicious user may take a **full** control of the system

In order to not let this happen, we are going to create a user with `sudo` privilages.
That is, the user will be able to perform administrative tasks, but

* it will require `sudo` prefix to do so, which will limit the number of *accidents*, and
* it will require a password, so that the adversary will not be able to run `sudo`

Now to the code (I will use my regular username `dbogatov` throughout the tutorials, you should use your own):

```
adduser dbogatov
```

Enter the password (preferably different from the `root` password), enter the full name, and leave all other fields empty.

Now let us grant the new user some privileges:

```
gpasswd -a dbogatov sudo
```

## Add a PK Authentication

Public Key Authentication is a way to login to your machine.
Think of it as a very long and random password that you store in a special file, and which is automatically substituted for you when you login.
As a result, there are some advantages - much more secure authentication (impossible to guess a key) and more convenient login procedure as you do not have to remember or type your password.
However there is a disadvantage - you can connect from your local machine only (the one which has that special file).
If you still want to connect from different places you can:

* share your keys among those machines (not recommended)
* setup PK Auth on ech of those machines
* connect from DO web console

Anyway, I belive that there is a little need to connect to your droplet from more than one (or two) machines, so let us go ahead and add PK Auth.

### Generate a key pair

First of all, you need to have a pair of keys - public and private - on your local machine.
As the names implies, your private key needs to be very secured and not shared, while the public key is accessible to the world.
The beauty of RSA (or say Public Key Cryptography, or Asymmetric Cryptography) is that you cannot derive one key from the other, but you can do some cool stuff with those asymmetric keys, like encrypting a message with one key and decrypting it with the other.

On your *local* machine (in my case, it is macOS), if you do not already have a key pair, generate one:

```
ssh-keygen
```

you will see

```
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/LOCAL_USERNAME/.ssh/id_rsa):
```

hit `enter`. 
You will be asked if you would like to secure your key with the passphrase.
If you do, this passphrase will serve as a symmetric key to encrypt your asymmetric key (how cool is that?).
Simply put, this key will not be used unless the password is provided.
It is a good idea to enable this feature.

### Add PK to the server

Now, that we have a key pair, it's time to provide a key (guess, which one) to the server.
The idea is that your server knows your public key, so whenever you want to connect you sign a request with your private key and the server verifies your signature with your public key.

The simple way to deploy your PK to the remote machine is to use a special tool on your **local** machine:

```
ssh-copy-id dbogatov@SERVER_IP_ADDRESS
```

Make sure you put your username instead of `dbogatov`, do not put `root`.

### Disable root login

Finally, it is important to disable `root` login through SSH.
It would still be possible to run as `root` from the `sudo` users, but it is dangerous to leave such a hole open.

#### Install text editor

You will probably need some text editor at some point of time.
There are at least 3 major players I know:

* *VIM* for geeks
* *nano* for newbies
* *emacs* for everybody else

I personally consider myself *everybody else*, so my favorite editor is *emacs*.
Let us install it (you are free to choose any editor, *nano* is the default one).

Update your local repositories

```
apt-get update # should run as root, or sudo
```

Upgrade packages (be careful with upgrading packages, sometimes dependencies may break)

```
apt-get upgrade
```

Install *emacs*

```
apt-get install emacs
```

If you have nothing installed, *emacs* will probably ask for about half-gig of space.
Don't blame *emacs* though!
There are some core packages, which most of other packages depend on and *emacs* will install those core packages.
*emacs* itself is around 20-30 MB, I believe.
Think of this 0.5 GB loss as a necessary evil.

### Configure SSH Daemon

The SSH daemon is the "program" responsible for your SSH sessions and connections.
Let us configure it such that it does not let `root` login.

```
emacs /etc/ssh/sshd_config
```

Find the line `PermitRootLogin yes` and change it to `PermitRootLogin no`.
Save the file (`C-x C-s` or `Ctrl-x` then `Ctrl-s` in *emacs*).
Exit editor (`C-x C-c` or `Ctrl-x` then `Ctrl-c` in *emacs*).

Reload SSH daemon:

```
service ssh restart
```

### Verify PK Auth 

If everything is setup correctly, you should be able to

* login to the machine without password (using a key, possibly passphrase)
* execute `sudo` commands

Let us verify that.
Exit the `root` session by executing `exit` command.

Connect to the machine:

```
ssh [YOUR_USERNAME]@[YOUR_IP]
```

**Tip:** if your username on the VPS matches your local username (like in my case, it is always `dbogatov`), you do not have to put it in front of the `@` sign. 
The system will automatically try to connect as local user.
The command in this case is this `ssh [YOUR_IP]`.

You now should see something like this:

```
[YOUR_USRNAME]@[DROPLET_NAME]:~$
```

Try to update your repositories:

```
sudo apt-get update
```

enter **your user's** password, not `root` password.
You should now see log messages that the repositories are updated.
That would mean that your were able to execute a command with `sudo` privilages.
