#!/usr/bin/env node
import { loadSecrets } from "./index";
import dotenv from "dotenv";
import fs from "fs";

(async () => {
  const parsed = (() => {
    try {
      const envsRead = dotenv.config();
      const parsed = envsRead?.parsed;
      if (!parsed) throw new Error("Can't parse .env or .env does not exist");
      return parsed;
    } catch (err) {
      // @ts-ignore
      console.info(err?.message);
      console.log("This is an optional. Having a .env file is not required");
      return {};
    }
  })();
  const newSecrets = await loadSecrets();
  const newDotEnv = Object.assign(parsed, newSecrets);
  const keys = Object.keys(newDotEnv);
  let str = "";
  for (let key of keys) {
    str += key + "=" + newDotEnv[key] + "\n";
  }
  fs.writeFileSync(".env", str);
})();
