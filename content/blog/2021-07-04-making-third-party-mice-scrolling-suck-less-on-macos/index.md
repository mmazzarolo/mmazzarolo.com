---
date: "2021-07-04"
title: "Making third-party mice scrolling suck less on macOS"
tags: [macos]
description: Here's how you can make any third-party mouse scrolling suck a bit less on macOS.
---

If you're using a third-party mouse on macOS, you must have noticed that the scrolling experience is... janky?

<div class="float-images">
  <video controls loop muted playsinline style="max-width: 100%; height: auto; width: 720px; aspect-ratio: 1.28643101">
    <source src="/videos/scrollbefore.mp4" type="video/mp4" />
  </video>
</div>

Nope, you're not looking at a video running at 10 FPS. This is how scrolling using a third-party mouse looks on macOS.

For reference, here's how scrolling with the same mouse looks on Windows 10:

<div class="float-images">
  <video controls loop muted playsinline style="max-width: 100%; height: auto; width: 720px; aspect-ratio: 1.29617">
    <source src="/videos/scrollwindows.mp4" type="video/mp4" />
  </video>
</div>

The first time I noticed this behaviour was a few years ago while using a [Logitech MX Master 2](https://www.logitech.com/en-us/products/mice/mx-master-3.910-005620.html). At first, I thought this was just an issue specific to that mouse, but after years of using third-party mice, it's evident it's because of the OS.

I don't know why the default scrolling settings on macOS behave this way. I suppose it's because the OS is optimized for the more "digital" scrolling of the Magic Trackpad and Magic Mouse... but it's just a theory.

Anyway, the good news is that you **can** achieve a smooth scrolling experience:

<div class="float-images">
  <video controls loop muted playsinline  style="max-width: 100%; height: auto; width: 720px; aspect-ratio: 1.28125247">
    <source src="/videos/scrollafter.mp4" type="video/mp4" />
  </video>
</div>

Unfortunately, you can't get there by tinkering with the macOS settings alone. Third-party software is required to achieve a buttery smooth scrolling experience.

I'm using [SmoothScroll](https://www.smoothscroll.net/mac/). It's a paid software (~9 EUR/y). I've been using it for years, and it's always promptly updated on new releases of macOS.

Other alternatives are:

- [MOS](https://mos.caldis.me/): A lightweight open-source tool used to smooth scrolling and set scroll direction independently for your mouse on macOS
- [SteerMouse](https://plentycom.jp/en/steermouse/): SteerMouse is a utility that lets you freely customize buttons, wheels, and cursor speed. This offers way more customization options than SmootScroll and MOS.
- [USB Overdrive](https://www.usboverdrive.com/): The USB Overdrive is a device driver for macOS that handles any USB or Bluetooth mouse, keyboard, trackball, joystick, gamepad, or gaming device from any manufacturer and lets you configure it either globally or on a per-application, per-device basis.
