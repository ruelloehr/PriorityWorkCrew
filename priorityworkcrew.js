/*
WorkCrew - a WebWorker work queue library

Usage:

  // Create an 8 worker pool using worker.js.
  var crew = new WorkCrew('worker.js', 8);

  // Do something whenever a job is completed.
  // The result object structure is
  // {
  //   id: work unit ID,
  //   result: message received from worker
  // }
  crew.oncomplete = function(result) {
    console.log(result.id, result.result);
  };

  // Add some work to the queue.
  // The work unit is postMessaged to one of
  // the workers.
  var workId = crew.addWork(myWorkUnit);

  // Add an onfinish event handler.
  // Fired when the queue is empty and all workers
  // are free.
  crew.onfinish = function() {
    console.log('All work in queue finished!');
  };

*/
WorkCrew = function(filename, count) {
  this.filename = filename;
  this.count = count || 4;
  this.queue = [];
  this.results = [];
  this.pool = [];
  this.working = {};
  this.uuid = 0;
  this.fillPool();
};

WorkCrew.prototype.onfinish = function() {};

WorkCrew.prototype.oncomplete = function(res) {
  return [res.id, res.result];
};

WorkCrew.prototype.addWork = function(work) {
  var id = this.uuid++;
  this.queue.push({id: id, work: work});
  this.processQueue();
  return id;
};

WorkCrew.prototype.processQueue = function() {
  if (this.queue.length == 0 && this.pool.length == this.count) {
    if (this.onfinish)
      this.onfinish();
  } else {
    while (this.queue.length > 0 && this.pool.length > 0) {

      this.queue.sort(function (a, b) {

          if (a.work.priority < b.work.priority)
            return (-1)
          else if (a.work.priority > b.work.priority)
            return (1)
          else if (a.createTime < b.createTime)
            return (-1);
          else if (a.createTime > b.createTime)
            return (1);
          else
            return (0);
      });



      var unit = this.queue.shift();
      var worker = this.pool.shift();
      worker.id = unit.id;
      this.working[worker.id] = worker;
      worker.postMessage(unit.work);
    }
  }
};

WorkCrew.prototype.addWorker = function() {

  var w = new Worker(this.filename);
  var self = this;
  w.onmessage = function(res) {
    var id = this.id;
    delete self.working[this.id];
    this.id = null;
    self.pool.push(this);
    try {
      self.oncomplete({id: id, result: res});
    } catch(e) {
      console.log(e);
    }
    self.processQueue();
  };
  this.pool.push(w);
};

WorkCrew.prototype.fillPool = function() {
  for (var i=0; i<this.count; i++) {
    this.addWorker();
  }
};

WorkCrew.prototype.destroy = function() {
    this.filename = '';
    this.count = 0;
    this.queue.length = 0
    this.results.length =0;
    for (var i=0; i< this.pool.length; i++)
    {
        console.log("term");
        this.pool[i].terminate();
    }
    this.pool.length = 0;
    this.working = {};
    this.uuid = 0;
}

