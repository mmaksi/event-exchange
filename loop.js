// node myFile.js

const pendingTimers = []; // executed in main thread
const pendingOSTasks = [doRequest]; // executed in main thread
const pendingOperations = [doFS, doHash, doHash, doHash, doHash]; // executed in libuv thread pool

// New timers, tasks, operations are recorded from myFile running
file.runContent();

function shouldContinue() {
  // 1. pending setTimeout, setInterval, setImmediate
  // 2. pending OS tasks: networking operations - http requests, server listening for incoming requests
  // 3. pending long running operations (fs read/write)
  return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// Event Loop body works in one 'tick'
while (shouldContinue()) {
  // 1. Node looks at pendingTimers and executes relevant callbacks: setTimeout, setInterval
  // 2. Node looks at pendingOSTasks and pendingOperations and executes relevant callbacks
  /* 3. Pauses execution, continues when...
        - a new pendingOSTask is done
        - a new pendingOperation is done
        - a timer is about to complete
    */
  // 4. Node looks at pendingTimers and executes relevant callbacks: setImmediate
  // 5. Handle 'close' events
}

// exit to the terminal
