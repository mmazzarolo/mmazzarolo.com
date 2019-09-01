---
date: "2019-08-30"
title: "Charles Proxy automation"
tags: [programming]
draft: true
---

[Charles Proxy](https://www.charlesproxy.com) is fantastic a cross-platform HTTP/HTTPS debugging proxy server application, one of the most user friendly of its genre. Its initial setup is painless and it can be configured trough a nice user interface.  

I've recently started to use it a lot more than what I was used to at my daily job so today I've spent some time checking in what way Charles can be automated trough a command line interface.  

> OSX11111

## Charles command-line options

Charles supports a few command line options out of the box, documented [here](https://www.charlesproxy.com/documentation/using-charles/command-line-options/).  
Unfortunately they seems to operate only as parameter for new Charles sessions, so you won't be able to run commands on a running instance of Charles. 

### Start a specific Charles session
A [Charles Session](https://www.charlesproxy.com/documentation/using-charles/sessions/) contains all of your recorded information. It is represented by the Session window; by default a new session is automatically created when you start Charles.  
Sessions can be saved from File -> Save Session (<kbd>Command</kbd>+<kbd>S</kbd>).  
Once saved, if you want to restart Charles from it can run:

```bash
/Applications/Charles.app/Contents/MacOS/Charles YOUR_SESSION_PATH 
```

### Start Charles with a specific configuration
This part is not well documented, so I had to dig a bit in the settings to understand how it works.     
By default Charles stores its configuration in `/Users/YOUR_USER/Library/Preferences/com.xk72.Charles.config`, a readable xml file that contains **all** the Charles settings.  
If needed, you can copy this file to another location, tweak the settings your interested into and start Charles directly from it:

```bash
/Applications/Charles.app/Contents/MacOS/Charles -config YOUR_CONFIG_PATH
```

Please notice that you can manually edit the configuration file only if Charles it not running. 

### Start Charles with throttling enabled
Easy peasy:
```bash
/Applications/Charles.app/Contents/MacOS/Charles -throttling
```

### Start Charles in headless mode
You can run Charles in headless mode, so that no UI will be presented, but it will still proxy content.  
```bash
/Applications/Charles.app/Contents/MacOS/Charles -headless
```

How can you control Charles in headless mode? You can use its Web Interface.  

## Charles Web Interface and Web Services

Charles has a [web interface](https://www.charlesproxy.com/documentation/using-charles/web-interface/) that enables you to control Charles from a browser, or using an external program using the web interface as a web service.

Enable the web interface using the Web Interface Settings option in the Proxy menu. You can allow anonymous access or you can configure usernames and passwords. You can access the web interface by visiting http://control.charles/ in a web browser configured to use Charles as its proxy.  

The web interface itself is a nice addition, but for my use case the most interesting part of it is that it exposes a few API endpoint that can be use to programmatically change the configuration of a running instance of Charles.  

They're not documented but, as suggested from the the official website, I was able to extract them from the web interface.  

Assuming that:
- `192.168.1.41` is the IP address of your Mac
- Charles is using the port `8888` (its default one)

You can invoke a command with cURL in this way:
```bash
curl -v -x http://192.168.1.41:8888 http://control.charles/YOUR_COMMAND
```

### Available commands

__Throttling commands__

- `/throttling/activate`: Enable the last used throttling preset.
- `/throttling/activate?preset=YOUR_PRESET`: Enable throttling with a specific preset.  
The throttling presets are:  
  * 56 kbps Modem: `56+kbps+Modem`  
  * 256 kbps ISDN/DSL: `256+kbps+ISDN%2FDSL`  
  * 512 kbps ISDN/DSL: `512+kbps+ISDN%2FDSL`  
  * 2 Mbps ADSL: `2+Mbps+ADSL`  
  * 8 Mbps ADSL2: `8+Mbps+ADSL2`  
  * 16 Mbps ADSL2+: `16+Mbps+ADSL2%2B`  
  * 32 Mbps VDSL: `32+Mbps+VDSL`  
  * 32 Mbps Fibre: `32+Mbps+Fibre`  
  * 100 Mbps Fibre: `100+Mbps+Fibre`  
  * 3G: `3G`  
  * 4g: `4G`  
- `/throttling/deactivate`

__Recording commands__

- `http://control.charles/recording/start`
- `http://control.charles/recording/stop`

__Tools commands__

- `http://control.charles/tools/breakpoints/enable`
- `http://control.charles/tools/breakpoints/disable`
- `http://control.charles/tools/no-caching/enable`
- `http://control.charles/tools/no-caching/disable`
- `http://control.charles/tools/block-cookies/enable`
- `http://control.charles/tools/block-cookies/disable`
- `http://control.charles/tools/map-remote/enable`
- `http://control.charles/tools/map-remote/disable`
- `http://control.charles/tools/map-local/enable`
- `http://control.charles/tools/map-local/disable`
- `http://control.charles/tools/rewrite/enable`
- `http://control.charles/tools/rewrite/disable`
- `http://control.charles/tools/black-list/enable`
- `http://control.charles/tools/black-list/disable`
- `http://control.charles/tools/white-list/enable`
- `http://control.charles/tools/white-list/disable`
- `http://control.charles/tools/dns-spoofing/enable`
- `http://control.charles/tools/dns-spoofing/disable`
- `http://control.charles/tools/auto-save/enable`
- `http://control.charles/tools/auto-save/disable`
- `http://control.charles/tools/client-process/enable`
- `http://control.charles/tools/client-process/disable`


### MORE- get current status from 