
import { $ } from "bun";

for await (let line of $`./measure`.lines()) {
  console.log(line); // Hello World!
}
