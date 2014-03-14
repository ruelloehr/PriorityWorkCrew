A priority based webworker implementation.

This code is based on: https://gist.github.com/kig/1188381


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


