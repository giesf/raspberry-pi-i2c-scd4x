
import { spawn } from "child_process";
import {$} from "bun"

async function main(){
  const ls = spawn('./measure');
  const hostname = await $`hostname`.text();
  ls.stdout.on('data', async (data) => {
    const jsonData = JSON.parse(data);
    const entries = Object.entries(jsonData);
    const timestamp = new Date().valueOf()
    const jsonL = entries.map(([metricName, metricValue])=>{
      return JSON.stringify({
        metrics: {
          __name__: Bun.env.METRIC_PREFIX + metricName,
          hostname
        },
        values: [metricValue],
        timestamps: [timestamp]
      })
    })
    const server = Bun.env.VM_SERVER
    const user = Bun.env.VM_USER
    const password = Bun.env.VM_PASSWORD
    const res = await fetch(server + "/api/v1/import", {
            method: "POST",
            body: jsonL,
            headers: {
                Authorization: "Basic " + btoa(user + ":" + password),
            },
        })
    console.log(res.ok)
    console.log(`stdout: ${data}`);
  });
  
  ls.stderr.on('data', async (data) => {
    console.error(`stderr: ${data}`);
  });
  
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  
}
main();
