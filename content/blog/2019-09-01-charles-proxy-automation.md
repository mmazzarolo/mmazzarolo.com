---
date: "2019-09-01"
title: "Charles Proxy automation"
tags: [programming]
draft: false
---

[Charles Proxy](https://www.charlesproxy.com) is fantastic a cross-platform HTTP/HTTPS debugging proxy server application, probably the most user friendly of its genre. Its initial setup is painless and it can be configured trough a nice user interface.

I've recently started to use it a lot more than what I was used to at my daily job, so today I've spent some time checking in what way the Charles usage can be automated trough a command line interface.

> Charles proxy is cross-platform, compatible with MacOS, Linux and Windows. The instructions shown in this post are based on MacOS, so if you're planning to follow it on another OS you might need some minor adjustments.

## Charles command-line options

Charles supports a few command line options out of the box, documented [here](https://www.charlesproxy.com/documentation/using-charles/command-line-options/).  
Unfortunately they seem to operate only as parameters for new Charles sessions, so you won't be able to run commands on a running instance of Charles.

**Start a specific Charles session**

A [Charles session](https://www.charlesproxy.com/documentation/using-charles/sessions/) contains all of your recorded information. It is represented by the Session window; by default a new session is automatically created when you start Charles.  
Sessions can be saved from **File → Save Session** (<kbd>⌘</kbd>+<kbd>S</kbd>).  
Once saved, if you want you can start Charles from the saved session by running:

```bash
/Applications/Charles.app/Contents/MacOS/Charles YOUR_SAVED_SESSION_PATH
```

**Start Charles with a specific configuration**

This part is not well documented, so I had to dig a bit in the settings to understand how it works.  
By default Charles stores its configuration in `/Users/YOUR_USER/Library/Preferences/com.xk72.Charles.config`, a readable xml file that contains **all** the Charles settings.  
If needed, you can copy this file to another location, tweak the settings your interested into and start Charles directly from it:

```bash
/Applications/Charles.app/Contents/MacOS/Charles -config YOUR_CONFIG_PATH
```

Please notice that you can manually edit the configuration file only if Charles it not running.

**Start Charles with throttling enabled**

Easy peasy:

```bash
/Applications/Charles.app/Contents/MacOS/Charles -throttling
```

**Start Charles in headless mode**

You can run Charles in headless mode, so that no UI will be presented, but it will still proxy content.

```bash
/Applications/Charles.app/Contents/MacOS/Charles -headless
```

How can you control Charles in headless mode? You can use its Web Interface.

## Charles Web Interface and Web Services

Charles has a [web interface](https://www.charlesproxy.com/documentation/using-charles/web-interface/) that enables you to control Charles from a browser, or using an external program using the web interface as a web service.

Enable the web interface using the Web Interface Settings option in the Proxy menu. You can allow anonymous access or you can configure usernames and passwords. You can access the web interface by visiting http://control.charles/ in a web browser configured to use Charles as its proxy.

The web interface itself is a nice addition, but for my use case the most interesting part of it is that it exposes a few endpoints that can be use to programmatically change the configuration of a running instance of Charles.

They're not documented but, as suggested from the the official website, I was able to extract them from the web interface.

Assuming that:

- `192.168.1.41` is the IP address of your Mac
- Charles is using the port `8888` (its default one)

You can invoke a command with cURL in this way:

```bash
curl -v -x http://192.168.1.41:8888 http://control.charles/YOUR_COMMAND
```

### Available commands

**Throttling commands**

- `/throttling/deactivate`
- `/throttling/activate`: Enable the last used throttling preset.
- `/throttling/activate?preset=YOUR_PRESET`: Enable throttling with one of these specific:
  - `56+kbps+Modem`: 56 kbps Modem
  - `256+kbps+ISDN%2FDSL`: 256 kbps ISDN/DSL
  - `512+kbps+ISDN%2FDSL`: 512 kbps ISDN/DSL
  - `2+Mbps+ADSL`: 2 Mbps ADSL
  - `8+Mbps+ADSL2`: 8 Mbps ADSL2
  - `16+Mbps+ADSL2%2B`: 16 Mbps ADSL2+
  - `32+Mbps+VDSL`: 32 Mbps VDSL
  - `32+Mbps+Fibre`: 32 Mbps Fibre
  - `100+Mbps+Fibre`: 100 Mbps Fibre
  - `3G`: 3G
  - `4G`: 4g

**Recording commands**

- `/recording/start`
- `/recording/stop`

**Tools commands**

- `/tools/breakpoints/enable`
- `/tools/breakpoints/disable`
- `/tools/no-caching/enable`
- `/tools/no-caching/disable`
- `/tools/block-cookies/enable`
- `/tools/block-cookies/disable`
- `/tools/map-remote/enable`
- `/tools/map-remote/disable`
- `/tools/map-local/enable`
- `/tools/map-local/disable`
- `/tools/rewrite/enable`
- `/tools/rewrite/disable`
- `/tools/black-list/enable`
- `/tools/black-list/disable`
- `/tools/white-list/enable`
- `/tools/white-list/disable`
- `/tools/dns-spoofing/enable`
- `/tools/dns-spoofing/disable`
- `/tools/auto-save/enable`
- `/tools/auto-save/disable`
- `/tools/client-process/enable`
- `/tools/client-process/disable`

### Getting a setting status

Using the same pattern shown above you can also get the status of a specific setting (`enabled`/`disabled`).  
Unfortunately it involves parsing the HTML output of the web interface but from my testing it seems to be working consistently:

Supposing you want to get the **rewrite** setting status you can run:

```bash
curl -v -x http://192.168.1.41:8888 http://control.charles/tools/rewrite/
```

It will give you the following HTML:

```html
<html>
  <head>
    <title>Charles Web Interface</title>
    <link rel="stylesheet" href="../../css/plain.css" />
  </head>
  <body>
    <h1>Charles Web Interface</h1>
    <h2>Rewrite</h2>
    <p>Status: Enabled</p>
    <ul>
      <li><a href="enable">Enable</a></li>
      <li><a href="disable">Disable</a></li>
      <li><a href="../">Back</a></li>
    </ul>
  </body>
</html>
```

If you look carefully you can easily spot the status, which appears always in the following way:

```html
<p>Status: STATUS</p>
```
