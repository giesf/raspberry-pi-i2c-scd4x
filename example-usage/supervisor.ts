
import { $ } from "bun";


async function main(){
  for await (let line of $`./measure`.lines()) {
    console.log(line); // Hello World!
  }
}
main();
