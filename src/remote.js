
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
