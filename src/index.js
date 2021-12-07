#!/usr/bin/env node

const path = require("path");
const yaml = require("js-yaml");
const fs = require("fs");

const DEFAULT_CONSOLERC_PATH = `/Users/${process.env.USER}/.consolerc.yml`;
const DEFAULT_CONSOLE_CONFIG = `/Users/${process.env.USER}/.console_passwd.yaml`;
const consoleRc = path.resolve(
  __dirname,
  process.env.CONSOLERC_PATH || DEFAULT_CONSOLERC_PATH
);
const consolePasswd = path.resolve(
  __dirname,
  process.env.CONSOLE_PASSWD_PATH || DEFAULT_CONSOLE_CONFIG
);
const arg = process.argv[2];
try {
  const rc = yaml.load(fs.readFileSync(consoleRc, "utf8"));
  const passwd = yaml.load(fs.readFileSync(consolePasswd, "utf8"));
  const targeConfig = passwd.find((i) => i.api_address === arg);
  if (!targeConfig) {
    return;
  }
  rc.authentication.login = targeConfig.username;
  rc.authentication.password = targeConfig.password;
  rc.console.api_address = targeConfig.api_address;
  fs.writeFile(consoleRc, yaml.dump(rc), function (e) {
    if (!e) {
      return;
    }
    console.error(e);
  });
} catch (e) {
  console.error(e);
}
