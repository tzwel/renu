// node . --i "*.mp3" --prefix "something :inc" --match "[A-z]"

process.removeAllListeners('warning');



const argv = require('minimist')(process.argv.slice(2));
const { globSync, renameSync } = require('node:fs')
const { extname, basename, join, dirname } = require('node:path')

const actions = {
	input(pattern) {
		const globFiles = globSync(pattern)
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
	// regex(pattern) {
	// 	throw Error('regex is not implemented yet')
	// },

	list() {
		data.files.forEach(file => {
			console.log(file.filename + file.extension + '\n');
		});
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
	files: []
}

let actionQueue = []

const validArguments = Object.keys(actions);

if (Object.entries(argv).length <= 1) {
	const help =
`Usage:
renu --i "*.mp3" --prefix something

Available args: ${validArguments.join(', ')}`
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
	// switch (key) {
	// 	case 'i':
	// 	case 'input':
	// 		return actionQueue.push(['input', value])
	// 	case 'prefix:
	// 		return actionQueue.push(['prefix', value])
	// 	case 'regex':
	// 		return actionQueue.push(['regex', value])
	// 	default:
	// 		return
	// }
}

// do actions on files in {data}
actionQueue.forEach((action)=> {
	actions[action[0]](action[1])
})

// rename in fs
data.files.forEach((file)=>{
	try {
		if (file.originalfilename + file.extension !== file.filename + file.extension) {
			renameSync(file.path, join(file.dirname, file.filename + file.extension))
			console.log(`Renamed ${file.originalfilename + file.extension} => ${file.filename + file.extension}`)
		}
	} catch {
		throw Error(`Couldn\'t rename ${file.filename + file.extension}!`)
	}
})

