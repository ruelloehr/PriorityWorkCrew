A priority based webworker implementation.

This code is based on: https://gist.github.com/kig/1188381

By default, any task you add to the workcrew queue will get a priority of 2 and a createTime timestamp.
The worklist will be sorted by priority, createTime.

You can set your own priority (e.g. 1) to cause tasks to be bumped to the front of the queue for processing.



Usage:

```
  var crew = new WorkCrew("yourScript.js", numWorkers);

  var task = {
  priority: 1    //an integer value
  yourdata: somevalue
  ...
  ...
  }
``

  var workId = crew.addWork(task);


