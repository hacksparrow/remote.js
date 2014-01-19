// ! developer should ensure the same signal array is passed to both, transmitter and receiver, else expect strange behaviors
Remote.transmitter = function(signals) {

  if (Remote.transmitter_instance) {
    return Remote.transmitter_instance;
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
    else {
      throw new Error('Number of signals should be less than or equal to ' + Remote.frequencies.length);
    }

    window.contextClass = ( window.AudioContext || 
      window.webkitAudioContext || 
      window.mozAudioContext || 
      window.oAudioContext || 
      window.msAudioContext );

    if (!contextClass) { alert('Web Audio API not available'); }
    else {

      var context = new contextClass();
      var oscillator;

      return {

        // don't keep it below 200, else accuracy is lost
        beep_duration: 200,

        // beep the input frequency
        beep: function(freq) {
          oscillator = context.createOscillator();
          oscillator.type = oscillator.SQUARE;
          oscillator.connect(context.destination);
          oscillator.frequency.value = freq;
          oscillator.start();
          setTimeout(function() {
            oscillator.stop();
          }, this.beep_duration);
        },

        emit: function(signal) {
          if (Remote.signals.indexOf(signal) > -1) { this.beep(Remote.mapping[signal]); }
          else { throw new Error('Signal "' + signal + '" not found'); }
        }

      }
    }
  }
  else { throw new Error('Signal array not found'); }
};