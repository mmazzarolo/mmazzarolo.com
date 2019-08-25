---
date: "2019-08-12"
title: "Activating the cursor keys at the center of the keyboard"
tags: [programming, hardware]
description: If you're remapping the cursor keys on macOS, try using the right Command key to activate them
images:
  - /images/blog/2019-08-12-about-the-apple-keyboard-layout/magic-keyboard.svg
draft: false
---

<br />
_Short post but TL;DR: If you're remapping the cursor keys on macOS, try using the <kbd>Right Command</kbd> key to activate them._

![](/images/blog/2019-08-12-about-the-apple-keyboard-layout/magic-keyboard.svg)

I am a firm believer that keeping the cursor keys to the center of your keyboard provides multiple benefits: to reach the cursor keys of your keyboard you need to move your palm, mapping the cursor keys to a set of keys in the center of your keyboard is an ergonomic solution to make you type faster.  
Vim users should be familiar with this approach, since Vim defaults the cursor keys to <kbd>H</kbd>, <kbd>J</kbd>, <kbd>K</kbd> and <kbd>L</kbd>.

For the last few years I've been using [Karabiner](https://pqrs.org/osx/karabiner/) on macOS to remap my keyboard keys so that pressing <kbd>Caps Lock</kbd> + <kbd>I</kbd>, <kbd>J</kbd>, <kbd>K</kbd> or <kbd>L</kbd> acts as cursor keys. I was surprised when I discovered that this seems to quite [a popular choice](https://tonsky.me/blog/cursor-keys/), but I think it has a major flaw: **you'll need to use two different hands to use the cursor keys**.  
Using two hands is perfectly fine if you need a simple cursor input (e.g.: moving between the options of a dropdown), but for my tastes it is often confusing when you start combining it with <kbd>Option</kbd>, <kbd>Command</kbd> and <kbd>Shift</kbd> for more complex actions... especially if you're used to press <kbd>Caps Lock</kbd> with your pinky (you probably should if you touch-type).

That's why I started looking for alternative solutions.  
After several different tests (e.g.: setting <kbd>Caps Lock</kbd> as a "switch" to toggle between the standard typing mode and the arrow movement mode, using <kbd>Option</kbd> instead of <kbd>Caps Lock</kbd>) I think I've finally found a solution to my issues.

**I moved the activation key from <kbd>Caps Lock</kbd> to the <kbd>Right Command</kbd> key.**

Since the activation key is now on the right side of the keyboard I can control it with ease with just my right hand. It took me a few hours of practice to make it "click": now even complex selections are manageable and I'm not actively thinking about which key combination I need to press anymore.  
If you're remapping the cursor keys on macOS, give it a try.
