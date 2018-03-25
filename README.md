# Pattern Lab Base

### Before you get started
- Keep all your work and assets in the `source` folder, since `public` will **BE WIPED** each time a production version is built. This includes images and fonts
- Don't use default `patternlab:serve`, as it will not watch or compile `.scss` files
- Use the same style as the examples, so `main.scss` file with `_other.scss` files `@imported` into it

### Avoid a headache
- **NEVER** add a space between an include and a parameter, else the console will fill up with warnings. I'm working on a fix for this, meanwhile:
  - Wrong: `{{< atoms-button (class="primary") }}`  
  - Right: `{{< atoms-button(class="primary") }}`  


- **ALWAYS** use plurals for `atoms`, `molecules` etc. Using `atom` will fill the console with warnings

- The following, when added to Sublime preferences, will remove those folders from "go to anything" `CMD + T` indexing. If you don't want to exclude `git` or `node_modules` folders, that's fine, but I strongly recommend you exclude `public` folder, otherwise you will constantly be jumping to wrong files, and you work will be overwritten or not showing up. In Sublime, `CMD + ,`, and just copy the following line to the user preferences:
  - `"binary_file_patterns": ["public/*", ".git/*", "node_modules/*"],`



### How to use
Just fork the repository and run `npm install`. You're all set.

### Gulp commands

`gulp` - for development  
`gulp production` for final build and deliverables


### Requires

[Node](https://nodejs.org) - Make sure it's 5.8.0 or higher
[gulp 4](http://gulpjs.com/) - Make sure it's 4. `npm i -g gulp@4` will install it globally.



### Includes

- Patternlab v3.0
- Bootstrap v4.0.0
- Basic folder structure and some example files


### Pattern Lab Base v1.0 changelog

- Added SCSS notifier, system default and command line notifications when a build fails (this will not stop watcher, it'll simply alert the user)  
- Added SCSS watcher to compile `.scss` files, runs in parallel to `patternlab:serve`
- Added custom asset migration for `gulp production`
