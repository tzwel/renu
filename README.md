# renu

Renu is a simple but powerful command line tool for renaming files in batches. It covers all the basic tasks such as adding prefixes and suffixes to filenames, and handles more advanced use cases like regex substitution and [custom filename formats using pre-defined tokens](#Batch-renaming---custom-filename-format)

---

## Installation

```sh
npm i -g git+https://github.com/tzwel/renu.git
```

## Usage

To see all available arguments, run `renu` without any arguments. For detailed usage information it's best to refer to this file

Arguments in renu are executed sequentially, meaning the order they are provided in is significant. For example - you can not rename files before they are read, so you must select them first with `--input {glob pattern}`

### Rename

This example renames all `.txt` files found to `some textfile.txt`. If multiple files are found, the name is kept with an incrementing counter appended to the filename like so: `some textfile (1).txt`

```sh
renu --input "*.txt" --rename "some textfile"

=> Renamed example.txt => some textfile (0).txt
=> Renamed secondexample.txt => some textfile (1).txt
```

If an extension is provided, it overwrites the original extension of the file
```sh
renu --input "textfile.txt" --rename "azip.zip"

=> Renamed textfile.txt => azip.zip
```

Most arguments can be shortened like so: `renu -i "textfile.txt" -r "azip.zip"`

#### Batch renaming - custom filename format

By default, renamed files follow the `filename (n).extension` format. However, you can customize this by using the `:counter` token in the `--rename` argument.

Here, we are changing the position of the counter to the front of the filename:

```sh
renu -i "*.txt" -r ":counter file"

Renamed something.txt => 0 file.txt
Renamed something.txt => 1 file.txt
Renamed something.txt => 2 file.txt
```

If you want to keep the original filename, use the `:filename` token:

```sh
renu -i "*.txt" -r ":counter :filename"

=> Renamed afile.txt => 0 afile.txt
=> Renamed differentfile.txt => 1 differentfile.txt
```

This doesn't really seem useful, but you can use it to customize a prefix/suffix further. For example label songs using a custom format

```sh
renu -i song.mp3 -r "artist - :filename"

=> Renamed song.mp3 => artist - song.mp3
```

### List

To see all matched files, simply provide the `--list` argument

```sh
renu -i "*.mp3" --list
```

### Prefixes, suffixes

**Prefixes** and suffixes are also trivial in renu

```sh
renu -i "*.doc" --prefix "awesome "

=> Renamed work.doc => awesome work.doc
=> Renamed stuff (1).doc => awesome stuff (1).doc
```

The same rules apply to **suffixes**:

```sh
renu -i "*.txt" --suffix "some suffix"
```

### Chaining (multiple operations at once)

You can easily perform multiple operations in one command

```sh
renu -i "*.zip" -r "foo" -p "pre" -s "suf"

=> Renamed file.zip => prefoosuf.zip
```

In the above example, we first change the name of the file to `foo` and *then* do all the work with suffixes and prefixes. If we were to change the order of operations by renaming the file at the end, the prefix and suffix would get overriden as renu executes operations sequentially.

```sh
renu -i "*.zip" -p "pre" -s "suf" -r "foo"

=> Renamed file.zip => foo.zip
```

### Regex

You can initialize a regex to use later with args like `substitute` using `--regex` or its shorthand `-x`.

```sh
renu -i "*" -x "s"
```

In the above example, the pattern will just look for the letter `s`. Once found, we can do many things with it, such as just remove it using `--remove`

#### Remove

By using `--remove` you can remove any string defined by `--regex`.

```sh
renu -i "*.mp3" -r "s" --remove

=> Renamed Bruno Mars - Treasure.mp3 => Bruno Mar - Treaure.mp3
```

```sh
renu -i "*.mp3" -x " \[\S+\]" --remove

=> Renamed Artist - Song [ewRjZoRtu0Y].mp3 => Artist - Song.mp3
```

### Substitute

By using `--substitute` you can replace any string defined by `--regex`.

```sh
renu -i "i like flowers.wav" -x "like" --substitute "love"

=> Renamed i like flowers.wav => i love flowers.wav
```

## You should know

Renu uses `globSync`, which was introuced in Node.js v22.0.0. Renu won't work on older versions of node.

Renu has only one dependency: [minimist](https://www.npmjs.com/package/minimist) for parsing arguments. Minimist itself has no dependencies. This is unlikely to ever change as I advocate for simplicity.

Renu currently doesn't support renaming files without an extension. This may change in the future. Most likely not.
