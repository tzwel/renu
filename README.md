# renu

A simple utility for renaming files

---

## Usage

To see all available arguments, run `renu` without any arguments. For detailed usage information it's best to refer to this file

Arguments in renu are executed sequentially, meaning the order they are provided is significant. For example - you can not rename files before they are read, so first you must read them with `--input {glob pattern}`

### Rename

This example renames all `.txt` files found to `some textfile.txt`. If multiple files are found, the name is kept with an incrementing counter appended to the filename like so: `some textfile (1).txt`

```
renu --input "*.txt" --rename "some textfile"

=> Renamed example.txt => some textfile (0).txt
=> Renamed secondexample.txt => some textfile (1).txt
```

If an extension is provided, it overwrites the original extension of the file
```
renu --input "textfile.txt" --rename "azip.zip"

=> Renamed textfile.txt => azip.zip
```

Every argument can be shortened like so: `renu -i "textfile.txt" -r "azip.zip"`

### List

To see all matched files, simply provide the `--list` argument

```
renu -i "*.mp3" --list
```

### Prefixes, suffixes

**Prefixes** and suffixes are also trivial in renu

```
renu -i "*.doc" --prefix "awesome "

=> Renamed work.doc => awesome work.doc
=> Renamed stuff (1).doc => awesome stuff (1).doc
```

The same rules apply to **suffixes**:

```
renu -i "*.txt" --suffix "some suffix"
```

### Chaining (multiple operations at once)

You can easily perform multiple operations in one command

```
renu -i "*.zip" -r "foo" -p "pre" -s "suf"

=> Renamed file.zip => prefoosuf.zip
```

In the above example, we first change the name of the file to `foo` and *then* do all the work with suffixes and prefixes. If we were to change the order of operations by renaming the file at the end, the prefix and suffix would get overriden as renu executes operations sequentially.

```
renu -i "*.zip" -p "pre" -s "suf" -r "foo"

=> Renamed file.zip => foo.zip
```