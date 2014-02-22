// ! developer should ensure the same signal array is passed to both, transmitter and receiver, else expect strange behaviors
Remote.receiver = function (signals) {

  if (Remote.receiver_instance) {
    return Remote.receiver_instance;
  }

  if (signals) {

    Remote.signals = signals;

    // create the signal:frequency mapping, signals can't be more than freqs
    if (signals.length <= Object.keys(Remote.frequencies).length) {
      signals.forEach(function(signal, i) {
        Remote.mapping[signal] = Remote.frequencies[i];
        Remote.reverse_mapping[Remote.frequencies[i]] = signal;
      });
    }
    else { throw new Error('Number of signals should be less than or equal to ' + Remote.frequencies.length); }

    var receiver = {

      on: function(signal, listener) {
        if (Remote.signals.indexOf(signal) > -1) {
          this.handlers[signal] = listener;
        }
        else { throw new Error('Signal "' + signal + '" not found'); }
      },

      // some optimal default values. changing these values are likely to cause sensitivity issues
      offset: 448, // required to index 0 the first freq and match with the signal index
      minDecibels: -55, // register only if the db beyond -55
      fftSize: 1024 * 2, // how much data to process, large => accurate but slower
      highpassValue: 5000, // register only frequencies beyond this
      minPercentage: 0.75, // how much of a freq should be found in a sample - lower freqs are more sensitive than higher

      // event handlers
      handlers: {},

      init: function init() {

        navigator.getUserMedia = (
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia );

        navigator.getUserMedia( { audio:true },

          function(stream) {

            window.contextClass = ( window.AudioContext || 
              window.webkitAudioContext || 
              window.mozAudioContext || 
              window.oAudioContext || 
              window.msAudioContext );

            window.requestAnimationFrame = (function() {
              return window.requestAnimationFrame  ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(callback){
                  window.setTimeout(callback, 1000 / 60);
              };
            })();

            // # the bulk of work goes under this condition
            if (!contextClass) { alert('Web Audio API not available'); }
            else { Remote.receiver_instance.listen(stream); }

          },

          function(err) { alert(err); }

        );

      },

      listen: function listen(stream) {

        var self = this;
        var context = new contextClass();

        // # source of sound
        var source = context.createMediaStreamSource(stream);

        // create a highpass filter
        var filter = context.createBiquadFilter();
        filter.type = filter.HIGHPASS;
        filter.frequency.value = self.highpassValue;
        source.connect(filter);

        // # create an analyzer node
        var analyser = context.createAnalyser();
        analyser.minDecibels = self.minDecibels;
        analyser.fftSize = self.fftSize;
        filter.connect(analyser);
        //analyser.connect(context.destination);

        // # script node to add programming capability
        var scriptNode = context.createScriptProcessor(2048, 1, 1);
        analyser.connect(scriptNode);
        scriptNode.connect(context.destination);

        var listening = false;
        var last_freq = false; // need to do this to prevent 'multiple times' detection
        var propagating = false; // event still propagating
        var propagation_period = 350; // propagation over in 350 ms
        var delim_found = false;
        var received_string = '';

        function listen() {

          var freqDomain = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(freqDomain);

          for (var freq_i = 0; freq_i < analyser.frequencyBinCount; freq_i++) {

            var value = freqDomain[freq_i];
            var percent = value / 256;

            // this frequency is found beyond the min percentage
            if (percent > self.minPercentage) {

              var freq = Math.round((self.offset - freq_i) / 10);
              var signal = Remote.signals[freq];

              if (last_freq !== freq && signal in Remote.mapping) {
                
                if (Remote.signals.indexOf(signal) > -1) {

                  if (!propagating) {

                    var signalo = {
                      name: signal,
                      time: Date.now()
                    };

                    Remote.receiver_instance.handlers[signal](false, signalo);
                    // ready to listen again
                    last_freq = false;

                    propagating = true;

                    setTimeout(function() {
                      propagating = false;
                    }, propagation_period);
                  }

                  // break out of this loop
                  break;
                }
                else Remote.receiver_instance.handlers[signal]((signal + ': not found'));
                
              }
              
              last_freq = freq;

            } // end of decibel check

          } // end of loop

          window.requestAnimationFrame(listen);
        }

        listen();

      }
    }

    receiver.init();

    Remote.receiver_instance = receiver;
    return receiver;
  }

  else {
    throw new Error('Signal array not found');
  }

};
