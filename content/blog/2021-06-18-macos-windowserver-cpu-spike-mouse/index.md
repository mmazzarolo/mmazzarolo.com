---
date: "2021-06-18"
title: 'Moving the cursor causes CPU spikes on macOS when using a gaming mouse'
tags: [macos, performance]
description:  Today I learned that, depending on the polling rate of the input device, just moving the cursor on macOS can cause CPU spikes.
---

I recently noticed that just moving the cursor on my MacBook Pro causes CPU spikes.  
The culprit is the WindowServer process: a core part of macOS responsible for drawing on the screen. 

<div class="float-images">
  <video autoplay controls loop muted playsinline>
    <source src="/videos/windowserver.mp4" type="video/mp4" />
  </video>
</div>

Sigh.

This seems to be a commonly reported bug (?) that started happening in Big Sur, where the WindowServer CPU usage scales with the polling rate of the input device:  

- [Apple.com - macOS Big Sur Window Server utilizes 100% CPU whenever USB mouse is moved
](https://discussions.apple.com/thread/252037451)
- [Reddit - Calling all Big Sur users here. Check “WindowServer” process usage while moving the cursor around. USB Mouse: 100% CPU. Trackpad: 50% usage.](https://www.reddit.com/r/mac/comments/juqcrd/calling_all_big_sur_users_here_check_windowserver/)
- [Reddit - Mouse lagging in big sur](https://old.reddit.com/r/MacOS/comments/juj8zs/mouse_lagging_in_big_sur/gcoxwma/?context=3) 
- [StackOverflow - WindowServer High CPU using external monitor - Big Sur
](https://apple.stackexchange.com/questions/407177/windowserver-high-cpu-using-external-monitor-big-sur)

I did some tests out of curiosity, and I can confirm that the CPU spike does scale with the polling rate. 

The mouse I'm using daily (the one used in the recording above) is a [Logitech Pro X Superlight](https://www.logitechg.com/en-us/products/gaming-mice/pro-x-superlight-wireless-mouse.html), a gaming mouse with a 1000 Hz polling rate (I use a gaming mouse even if I don't play videogames because I'm very sensitive to input delay).  
After a fresh start, with a 1000Hz polling, rate WindowServer goes from ~2% to ~50% CPU usage. Lowering the polling rate to 125Hz (the lowest polling rate I can choose) makes the WindowServer reach ~20% CPU usage.   

Then, I tried with two other mice: a [Logitech G203](https://www.logitechg.com/en-US/products/gaming-mice/g203-prodigy-gaming-mouse.html) (wired) that produced the same results, and an Amazon Basics wireless mouse (no idea what its polling rate is), which made WindowServer reach ~25% CPU usage.   

Finally, I tried and with a Magic Trackpad 2 (which should have a polling rate of ~90Hz) and with the built-in MacBook trackpad, and **there were almost no changes to the WindowServer CPU usage**. 

> I did my test on two different MacBooks with Big Sure (both producing similar results):
> - MacBook Pro (16-inch, 2019), 2,3 GHz 8-Core Intel Core i9, 16 GB 2667 MHz DDR4, AMD Radeon Pro 5500M 4 GB
> - MacBook Pro (15-inch, 2017), 2,8 GHz Quad-Core Intel Core i7, 16 GB 2133 MHz DDR3, Intel HD Graphics 630 1536 MB

I'd love to learn why and how Big Sur introduced this issue in macOS... but I feel I'll never know the answer :)