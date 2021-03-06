/* (c) 2015 Felipe Astroza A.
 * Under BSD License
 * Based on https://github.com/rokgregoric/html5record/blob/master/recorder.js
 */
var worker = new Worker('/js/recorder/ogg_encoder_worker.js');

(function(window){

  var Recorder = function(source, cfg){
    var z = this;
    this.context = source.context;
    this.node = this.context.createScriptProcessor(4096, 2, 2);
    worker.postMessage({
      cmd: 'init',
      sampleRate: this.context.sampleRate
    });
    var recording = false;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({
        cmd: 'write',
        leftData: e.inputBuffer.getChannelData(0),
        rightData: e.inputBuffer.getChannelData(1),
        samplesCount: e.inputBuffer.getChannelData(0).length
      });
    };

    this.record = function(){
      recording = true;
    };

    this.stop = function(){
      recording = false;
      worker.postMessage({cmd: 'finish'});
    };

    this.ondataavailable = function(blob) {
    };

    worker.onmessage = function(e){
      var data = new Uint8Array(e.data.buffer, 0, e.data.outputLength);
      z.ondataavailable({data: data});
    };

    source.connect(this.node);
    this.node.connect(this.context.destination);
  };

  window.Recorder = Recorder;

})(window);