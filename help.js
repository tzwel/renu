// This file is a test of naive markdown parsing to provide documentation inside renu. This is a subject to change.

const { readFileSync } = require('node:fs')
const { join } = require('node:path')

const c = {
	'g': '\x1b[32m',
	'y': '\x1b[33m',
	'b': '\x1b[34m',
	'reset': '\x1b[0m'
}

const helpFilePath = 'README.md'

const input = 'remove'

const regex = new RegExp(`### ${input}(.|\n|\r\n|\r)+?(#)`, 'gmi')
const codeRegex = /\`\`\`(.|\n|\r\n|\r)+\`\`\`/gmi

const docs = readFileSync(join(__dirname, helpFilePath), {encoding: 'utf8', flag: 'r'})

let processedDocs = docs.match(regex).join()
let codeLines = processedDocs.match(codeRegex)

console.log(
	processedDocs
	.replaceAll(/\r\n\r\n\r\n/g, '\r\n')
	.replaceAll(/\#$/g, '')
	.replaceAll(/\#\#\# ([A-z]+)/gm,`${c.g}$1${c.reset}`)
	.replaceAll('```sh\r\n', `> `)
	.replaceAll(/\=\> ([A-z \S]+)/gm,`Result: ${c.b}$1${c.reset}`)
	.replaceAll('\n```', `${c.reset}`)
	.replaceAll(/\`([A-z-]+)\`/gm,`${c.y}$1${c.reset}`)
	.replaceAll(/(\n|\r\n|\r| )+$/g, '')
	.trim()
);