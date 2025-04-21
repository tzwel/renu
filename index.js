#!/usr/bin/env node

process.removeAllListeners('warning')

const argv = require('minimist')(process.argv.slice(2))
const { globSync, renameSync } = require('node:fs')
const { extname, basename, join, dirname } = require('node:path')

const specials = {
	incrementTemplate: ':counter',
	filename: ':filename'
}

const actions = {
	version() {
		const package = require('./package.json')
		console.log(package.version);
	},
	v() { actions.version() },

	input(pattern) {
		const globFiles = globSync(join(process.cwd(), pattern))
		globFiles.forEach((file)=> {
			let ext = file.match(/\.[^\(\ \/\n)]+$/gi) // swapped from original extname
			// don't work on directories
			if (ext) {
				ext = ext[0]
				data.files.push(
					{
						'dirname': dirname(file),
						'path': file,
						'originalfilename': basename(file, ext),
						'filename': basename(file, ext),
						'extension': ext
					}
				)
			}
		})
	},
	i(pattern) { actions.input(pattern) },

	rename(name) {
		let customCounter = false
		if (name.includes(specials.incrementTemplate)) {
			customCounter = true
		}


		if (data.files.length === 1) {
			name = name
				.replaceAll(specials.filename, data.files[0].filename);
			data.files[0].filename = name
		} else {
			data.files.forEach(file => {
				let newFilename = name
					.replaceAll(specials.filename, file.filename);

				if (!customCounter) {
					file.filename = `${newFilename} (${data.index})`
				} else {
					file.filename = newFilename
						.replaceAll(specials.incrementTemplate, data.index)
				}

				data.index += 1
			})
		}
	},
	r(name) { actions.rename(name) },

	regex(expression) {
		data.regex = new RegExp(expression, 'gm');
	},
	x(expression) { actions.regex(expression) }, // x from eXpression

	remove() {
		if (!data.regex) {
			console.log(`To use remove, you first must define a regex. --regex or -x `);
			return process.exit(1)
		}
		for (let i = 0; i < data.files.length; i++) {
			const file = data.files[i]
			file.filename = file.filename.replace(data.regex, '')
		}
	},

	substitute(string) {
		if (!data.regex) {
			console.log(`To use substitute, you first must define a regex. --regex or -x `);
			return process.exit(1)
		}
		for (let i = 0; i < data.files.length; i++) {
			const file = data.files[i]
			file.filename = file.filename.replace(data.regex, string)
		}
	},
	sub(string) { actions.regex(string) },


	list() {
		data.files.forEach(file => {
			console.log(file.filename + file.extension)
		})
	},
	l() { actions.list() },

	prefix(string) {
		for (let i = 0; i < data.files.length; i++) {
			const file = data.files[i]
			file.filename = string + file.filename
		}
	},
	p(string) { actions.prefix(string) },

	suffix(string) {
		for (let i = 0; i < data.files.length; i++) {
			const file = data.files[i]
			file.filename = file.filename + string
		}
	},
	s(string) { actions.suffix(string) },
}

let data = {
	count: 0,
	regex: '',
	index: 0,
	files: []
}

let actionQueue = []

const validArguments = Object.keys(actions)

if (Object.entries(argv).length <= 1) {
	const help =
`Usage:
renu --i "*.mp3" --prefix something

Available args: ${validArguments.join(', ')}

For detailed usage information refer to README.md`
	console.log(help)
}

for (const [key, value] of Object.entries(argv)) {
	if (key === '_') {
		continue
	}
	if (!validArguments.includes(key)) {
		console.log(`Invalid argument "${key}". Invoke without arguments for help`)
		process.exit()
	}
	insertToQueue(key, value)
}


function insertToQueue(key, value) {
	return actionQueue.push([key, value])
}

// do actions on files in {data}
actionQueue.forEach((action)=> {
	actions[action[0]](action[1])
})


// rename in fs
data.files.forEach((file)=>{
	try {
		
		// second condition is a fix to the .git (or similar files) bug when the extension is the same as the filename
		if (/\.[^\(\ \/\n)]+$/gi.test(file.filename) && file.filename !== file.extension) {
			console.log(file.filename);
			renameSync(file.path, join(file.dirname, file.filename))
			console.log(`Renamed ${file.originalfilename + file.extension} => ${file.filename}`)
			data.count += 1
		} else if (file.originalfilename + file.extension !== file.filename + file.extension) {
			renameSync(file.path, join(file.dirname, file.filename + file.extension))
			console.log(`Renamed ${file.originalfilename + file.extension} => ${file.filename + file.extension}`)
			data.count += 1
		} 
		// else {
		// 	console.log('No action was taken.');
		// }
	} catch(err) {
		console.log(err);
		throw Error(`Couldn\'t rename ${file.filename + file.extension}!`)
	}
})

if (data.count > 1) {
	console.log(`Renamed ${data.count} ${data.count === 1 ? 'file' : 'files'}`);
}

// export for testing
module.exports = { data, actions }