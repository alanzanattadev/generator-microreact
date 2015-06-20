var generators = require('yeoman-generator');
var fs = require('fs');
var spawn = require('cross-spawn');

module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);
  },
  initializing: function() {

  },
  prompting: function () {
    var done = this.async();
    this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
      default : this.appname // Default to current folder name
    }, {
      type    : 'input',
      name    : 'description',
      message : 'Your project description'
    }, {
      type    : 'input',
      name    : 'author',
      message : 'Your project author'
    }, {
      type    : 'input',
      name    : 'repo',
      message : 'Your project repository'
    }, {
      type    : 'list',
      name    : 'basebranch',
      message : 'Do you want the base commits in another branch ?',
      choices : [
        'Yes',
        'No'
      ]
    }], function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
  },
  configuring: function() {
    // prepare package.json
    var packageJson = {
      name: this.answers.name,
      description: this.answers.description,
      author: this.answers.author,
      version: "0.1.0",
      license: "ISC",
      keywords: [
        "react",
        this.author,
        "web"
      ],
      repository: {
        type: "git",
        url: this.answers.repo
      },
      main: "server.js",
      scripts: {
        test: "gulp test",
        start: 'gulp watch'
      }
    };
    this.packageJson = packageJson;
    // prepare packages to install
    this.toInstall = [
      "flux",
      "object-assign",
      "react"
    ];
    this.toInstallDev = [
      "browser-sync",
      "browserify",
      "karma",
      "lodash.assign",
      "gulp",
      "gulp-flowtype",
      "gulp-karma",
      "gulp-minify-css",
      "gulp-minify-html",
      "gulp-mocha",
      "gulp-react",
      "gulp-sass",
      "gulp-sourcemaps",
      "gulp-uglify",
      "gulp-util",
      "mocha",
      "reactify",
      "should",
      "uglify",
      "vinyl-buffer",
      "vinyl-source-stream",
      "watchify"
    ];
    if (this.answers.repo != "")
      this.repo = this.answers.repo;
  },
  default: function() {

  },
  writing: function() {
    // init git
    spawn.sync('git', ['init']);
    spawn.sync('git', ['commit', '--allow-empty', '-m', 'initial commit']);
    // write .gitignore
    this.fs.copyTpl(this.templatePath("gitignore"), this.destinationPath("./.gitignore"));
    // write yeoman rc
    this.config.save();
    // write README.md
    this.fs.copyTpl(this.templatePath("README.md"), this.destinationPath("README.md"), {
      project: {
        name: this.answers.name,
        description: this.answers.description,
        author: this.answers.author
      }
    });
    // write package.json
    this.fs.writeJSON("./package.json", this.packageJson);
    // create lib folder
    fs.mkdirSync(this.destinationPath("./lib"));
    // create flux folders
    fs.mkdirSync(this.destinationPath("./lib/actions"));
    fs.mkdirSync(this.destinationPath("./lib/components"));
    fs.mkdirSync(this.destinationPath("./lib/dispatchers"));
    this.fs.copyTpl(this.templatePath("dispatcher.js"), this.destinationPath("./lib/dispatchers/dispatcher.js"));
    fs.mkdirSync(this.destinationPath("./lib/stores"));
    // create web folders
    fs.mkdirSync(this.destinationPath("./lib/styles"));
    // create spec folder
    fs.mkdirSync(this.destinationPath("./specs"));
    fs.mkdirSync(this.destinationPath("./specs/unit"));
    fs.mkdirSync(this.destinationPath("./specs/e2e"));
    // create config folder
    fs.mkdirSync(this.destinationPath("./configs"));
    // create dist folder
    fs.mkdirSync(this.destinationPath("./dist"));
    // write gulpfile.js
    this.fs.copyTpl(this.templatePath("gulpfile.js"), this.destinationPath("./gulpfile.js"));
    // if repo : git remote add origin ...
    if (this.repo)
      spawn.sync('git', ['remote', 'add', 'origin', this.repo]);
  },
  conflicts: function() {

  },
  install: function() {
    // install npm devDependencies
    if (this.toInstallDev)
      this.npmInstall(this.toInstallDev, {'saveDev': true});
    // install npm dependencies
    if (this.toInstall)
      this.npmInstall(this.toInstall, {'save': true});
  },
  end: function() {
    // if repo : git add / git commit / git push
    if (this.git) {
      if (this.answers.basebranch == 'Yes') {
        spawn.sync('git', ['checkout', '-b', 'base-project']);
      }
      spawn.sync('git', ['add', '.gitignore']);
      spawn.sync('git', ['commit', '-m', '.gitignore']);
      spawn.sync('git', ['add', '.']);
      spawn.sync('git', ['commit', '-m', 'base project']);
      if (this.answers.basebranch == 'Yes') {
        spawn.sync('git', ['checkout', 'master']);
        spawn.sync('git', ['merge', 'base-project', '--no-ff']);
      }
      if (this.repo)
        spawn.sync('git', ['push', 'origin', 'master']);
    }
  }
});
