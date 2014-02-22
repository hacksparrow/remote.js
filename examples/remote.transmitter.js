
var Remote = {

  // these are references to the transmitter and receiver singletons
  transmitter_instance: false,
  receiver_instance: false,

  // developer has to decide on the signal names - can't exceed the number for frequencies
  signals: [],
  // map of signal to frequency. eg: 'scroll up':4930, 'scroll down':5140
  mapping: {},
  // to quickly look up signal from frequency. eg: 4930:'scroll up', 5140:'scroll down'
  reverse_mapping: {}

  // these are HAND-PICKED frequencies which are most reliably transceived - currently 13 in number
  , frequencies: [9650, 9450, 9240, 9010, 8800, 8590, 8370, 8170, 7950, 7730, 7510, 7300, 7070]

};

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
          oscillator.start(0);
          setTimeout(function() {
            oscillator.stop(0);
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