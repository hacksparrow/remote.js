Remote.js
=========

Remote.js is a library for developing remote controlled web apps. It is wireless and does not require additional hardware - it works via audio frequencies.

## Quick demo

**Note**: Apps tested on Google Chrome only. If the examples don't work, try restarting the browser.

* [Open the demo app on your desktop / laptop](http://hacksparrow.github.io/remote.js/example/controlled.html)
* [Open the remote controller app on your smartphone](http://hacksparrow.github.io/remote.js/example/controller.html)

Once the apps are loaded, point the remote at the demo, and press the buttons.

## How to use

To develop a remote controlled web app using Remote.js, you will need to create a **transmitter** (remote controller) and a **receiver** (the web app). The  app listens for 'signals' from the transmitter and executes JavaScript code programmed by you, when it receives them.

### Creating a transmitter

Include [remote.transmitter.js](https://raw2.github.com/hacksparrow/remote.js/master/dist/remote.transmitter.js) in the transmitter app's HTML page. Once included, you can create a transmitter as shown in this example.

    var signals = ['cat', 'HIDE CONTENT', 'github'];
    var t = Remote.transmitter(signals);

    // ideally, signals would be emitted when buttons are clicked
    document.querySelector('#cat-button').addEventListener('click', function() {
      t.emit('cat');
    });

    document.querySelector('#github-button').addEventListener('click', function() {
      t.emit('github');
    });

    // signals can be emitted any way you like, though
    setTimeout(function() {
      t.emit('foo');
    }, 5000);

**NOTE**

1. Signal names can be anything of your choice.
2. The signal array MUST be the same for both the transmitter and the receiver.
3. Currently, a max of 13 signals are supported.

### Creating a receiver

Include [remote.receiver.js](https://raw2.github.com/hacksparrow/remote.js/master/dist/remote.receiver.js) in the receiver app's HTML page. Once included, you can create a receiver as shown in this example.

    var signals = ['cat', 'HIDE CONTENT', 'foo'];
    var r = Remote.receiver(signals);

    r.on('cat', function(error, signal) {
      if (!error) alert('Cats are mini-Tigers!');
    });

    r.on('HIDE CONTENT', function(error, signal) {
       document.querySelector('#content').style.display = 'none';
    });

    r.on('github', function(error, signal) {
      window.open('https://github.com');
    });

What the signal can do is entirely upto you, the developer. Anything you can do with JavaScript, a valid signal can trigger it. Let your imaginations run wild!

## Possible uses

1. Media controls
2. Games - remote controlled, multi-player
3. Slideshows
4. Pranks
5. Malware
6. Interesting browser extensions

## Todo

1. Increase the number of supported signals
2. Cross-browser fixes

## Background

I set out to create a wireless data transfer medium using acoustic frequencies, but faced some challenges because of which I paused worked on it, and instead created Remote.js out of the work done so far.

The following are some interesting points from my experiment.

Equipment used: Web Audio API, Nexus 5 (transmitter), MacBook Pro (receiver).

1. The mic is very bad at 'listening to' some random frequencies (even loud audible frequencies). This may be resonance and / or interference from the computer parts.
2. As the frequency crosses 15khz, the amplitude decreases in a proportionate manner - the range decreases as a result.
3. Frequency bleeding and interference is rampant. This can be avoided by keeping a significant gap between the bit-frequencies. Because of problem no. 2, using higher frequencies is almost impossible.
4. Surprisingly, interference from a normal work / home background environment is very rare.
5. The bitrate has to be very low. If you try to increase it, you lose accuracy in frequency detection.
6. I used ASCII 'symbols' for higher bandwidth. Using binary 'symbols' binary files can be transferred more reliably, but the bandwidth would be waaay lower.


## License (MIT)

Copyright (c) 2014 Hage Yaapa <[http://www.hacksparrow.com](http://www.hacksparrow.com)>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


