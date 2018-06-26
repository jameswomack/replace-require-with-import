#!/usr/bin/env node

const FS = require("fs");
const globby = require("globby");
// const createStore = require('redux')
const r1 = /^(let|var|const) +([a-zA-Z_$][a-zA-Z0-9_$]*) +\= +(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)/gm;
// const createStore = require('redux').createStore
const r2 = /^(let|var|const) +([a-zA-Z_$][a-zA-Z0-9_$]*) +\= +(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)\.([a-zA-Z][a-zA-Z0-9]+)/gm;
// const { createStore } = require('redux')
const r3 = /^(let|var|const) +(\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}) +\= +(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)/gm;
// require('index.less')
const r4 = /^(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)/gm;
// const { Modal, DatePicker, Radio, Select, InputNumber, Table, message } = require('antd')
const r5 = /^(let|var|const) +(\{(.*)\}) +\= +(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)/gm
const args = process.argv.slice(2);

if (!args.length) {
  console.error(
    'Please pass a directory glob to "replace-require-with-import"\n'
  );
  process.exit(1);
}

const paths = globby.sync(args);

paths.forEach(function(p) {
  if (!FS.statSync(p).isDirectory()) {
    return replaceInFile(p);
  }
});

function replaceInFile(fp) {
  const result = FS.writeFileSync(
    fp,
    FS.readFileSync(fp, "utf-8")
      .replace(r5, `import { $3 } from $5`)
      .replace(r3, `import { $3 } from $5`)
      .replace(r2, `import { $7 as $2 } from $4`)
      .replace(r1, `import $2 from $4`)
      .replace(r4, `import $2`),
    "utf-8"
  );
  console.log(`> ${fp}`);
  return result;
}

console.info("Done!\n");
