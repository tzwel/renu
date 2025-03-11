# renu

A simple utility for renaming files

---

## Usage

To see all available arguments, run `renu` without any arguments. For detailed usage information it's best to refer to this file

Arguments in renu are executed sequentially, meaning the order they are provided in is significant. For example - you can not rename files before they are read, so first you must read them with `--input {glob pattern}`

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

**Warning: this is an experimental feature**

You can initialize a regex to use later with args like `substitute` using `--regex` or its shorthand `-x`.

### Substitute

**Warning: this is an experimental feature**

By using `--substitute` you can replace any string defined by `--regex`.

```sh
renu -i "*.mp3" -x "\[\S+\]" --substitute ""

Renamed Artist - Song [ewRjZoRtu0Y].mp3 => Artist - Song .mp3
```


## You should know

Renu uses `globSync`, which was introuced in Node.js v22.0.0. Renu won't work on older versions of node.

Renu has only one dependency: [minimist](https://www.npmjs.com/package/minimist) for parsing arguments. Minimist itself has no dependencies. This is unlikely to ever change as I advocate for simplicity.
