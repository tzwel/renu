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
	input(pattern) {
		const globFiles = globSync(join(process.cwd(), pattern))
		globFiles.forEach((file)=> {
			const ext = extname(file)
			data.files.push(
				{
					'dirname': dirname(file),
					'path': file,
					'originalfilename': basename(file, ext),
					'filename': basename(file, ext),
					'extension': ext
				}
			)
		})
	},
	i(string) { actions.input(string) },

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
				name = name
				.replaceAll(specials.filename, file.filename);

				if (!customCounter) {
					file.filename = `${name} (${data.index})`
				} else {
					file.filename = name
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

	substitute(string) {
		if (!data.regex) {
			console.log(`To use substitute, you first must define a regex. --regex or -x `);
			return process.exit(1)
		}
		console.log(string.length);
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
	return actionQueue.push([key, value.trim()])
}

// do actions on files in {data}
actionQueue.forEach((action)=> {
	actions[action[0]](action[1])
})

// rename in fs
data.files.forEach((file)=>{
	try {
		
		if (/\.[^\(\ )]+$/gi.test(file.filename)) {
			renameSync(file.path, join(file.dirname, file.filename))
			console.log(`Renamed ${file.originalfilename + file.extension} => ${file.filename}`)
		} else if (file.originalfilename + file.extension !== file.filename + file.extension) {
			renameSync(file.path, join(file.dirname, file.filename + file.extension))
			console.log(`Renamed ${file.originalfilename + file.extension} => ${file.filename + file.extension}`)
		} 
		// else {
		// 	console.log('No action was taken.');
		// }
	} catch {
		throw Error(`Couldn\'t rename ${file.filename + file.extension}!`)
	}
})

