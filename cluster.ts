import cluster, { worker } from "cluster";
import os from "os";

if (cluster.isMaster) {
  // Take advantage of multiple CPUs (CPU cores)
  const cpus = os.cpus().length;

  console.log(`Taking advantage of ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  // Set console's directory so we can see output from workers
  console.dir(cluster.workers, { depth: 0 });

  // intialize our CLI
  process.stdin.on("data", (data) => console.log(data));

  cluster.on("exit", (worker, code) => {
    // Good exit code is 0 :))
    // exitedAfterDisconnect ensures that it is not killed by master cluster or manually
    // if we kill it via .kill or .disconnect it will be set to true
    // \x1b[XXm represents a color, and [0m represent the end of this
    //color in the console ( 0m sets it to white again )
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(
        `\x1b[34mWorker ${worker.process.pid} crashed.\nStarting a new worker...\n\x1b[0m`
      );
      const new_worker = cluster.fork();
      console.log(
        `\x1b[32mWorker ${new_worker.process.pid} will replace him \x1b[0m`
      );
    }
  });

  console.log(`Master PID: ${process.pid}`);
} else {
  // how amazingly simple it is for workers to start a job
  require("./index");
}
