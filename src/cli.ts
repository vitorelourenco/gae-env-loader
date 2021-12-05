#!/usr/bin/env node
import { loadSecrets } from "./index";
import dotenv from "dotenv";
import fs from "fs";

(async () => {
  const { parsed } = dotenv.config() || {};
  const newSecrets = await loadSecrets();
  const newDotEnv = Object.assign(parsed, newSecrets);
  const keys = Object.keys(newDotEnv);
  let str = "";
  for (let key of keys) {
    str += key + "=" + newDotEnv[key] + "\n";
  }
  fs.writeFileSync(".env", str);
})();
