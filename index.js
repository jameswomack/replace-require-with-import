#!/usr/bin/env node

const FS   = require('fs')
const Path = require('path')
const r1   = /^(let|var|const) +([a-zA-Z][a-zA-Z0-9]*) +\= +(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)/gm
const r2   = /^(let|var|const) +([a-zA-Z][a-zA-Z0-9]*) +\= +(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)\.([a-zA-Z][a-zA-Z0-9]+)/gm

const args = process.argv.slice(2)

if (!args.length) {
  console.error('Please pass a directory glob to "replace-require-with-import"\n')
  process.exit(1)
}

args.forEach(function (p) {
  !p.match(/\/$/) && console.info(`Skipping ${p}, not a directory`)
  FS.readdirSync(p)
    .map(function (n) { return Path.join(p, n) })
    .forEach(function (fp) {
      if (FS.statSync(fp).isDirectory()) return null
      return FS.writeFileSync(fp, FS.readFileSync(fp, 'utf-8')
        .replace(r2, `import { $7 as $2 } from $4;`)
        .replace(r1, `import $2 from $4`), 'utf-8')})})

console.info('Done!\n')
