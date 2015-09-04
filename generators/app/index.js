var generators = require('yeoman-generator');
var fs = require('fs');
var spawn = require('cross-spawn');

module.exports = generators.Base.extend({
  _getQuestions: function() {
    return [
      {
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
        name    : 'repository',
        message : 'Your project repository'
      }, {
        type    : 'confirm',
        name    : 'basebranch',
        message : 'Do you want the base commits in another branch ?',
        default : false
      }, {
        type    : 'list',
        name    : 'type',
        message : 'What type of app is it',
        choices : [
          'Web',
          'Cordova'
        ]
      }, {
        type    : 'input',
        name    : 'cordovaPackage',
        message : 'Your cordova package name',
        when    : function(answers) {return answers.type == 'Cordova';}
      }, {
        type    : 'input',
        name    : 'cordovaDisplayText',
        message : 'Your cordova display name',
        when    : function(answers) {return answers.type == 'Cordova';}
      }, {
        type    : 'confirm',
        name    : 'bower',
        message : 'Will you use Bower ?',
        default : true
      }, {
        type    : 'checkbox',
        name    : 'frameworks',
        message : 'What frameworks will you use ?',
        choices : [
          'react-bootstrap'
        ]
      }
    ];
  },

  _getNpmDefaultPackages: function() {
    return {
      prod: [
        "flux",
        "object-assign",
        "react",
        "react-router",
        "classnames"
      ],
      dev: [
        "gulp",
        "gulp-flowtype",
        "gulp-karma",
        "gulp-minify-css",
        "gulp-minify-html",
        "gulp-concat",
        "gulp-mocha",
        "gulp-react",
        "gulp-sass",
        "gulp-sourcemaps",
        "gulp-uglify",
        "gulp-util",
        "gulp-babel",
        "gulp-task-listing",
        "karma-mocha",
        "karma-chrome-launcher",
        "karma-browserify",
        "karma",
        "reactify",
        "watchify",
        "babelify",
        "browserify",
        "uglify",
        "browser-sync",
        "lodash.assign",
        "mocha",
        "should",
        "vinyl-buffer",
        "vinyl-source-stream"
      ]
    };
  },
  _getNpmPackages: function() {
    var packages = this._getNpmDefaultPackages();
    // Bower
    if (this.answers.bower == 'Yes') {
      packages.prod.push('bower');
    }
    // Bootstrap
    packages.prod.push('react-bootstrap');
    if (this.answers.frameworks.indexOf('react-bootstrap') != -1 &&
        !this.this.answers.bower)
      packages.prod.push('bootstrap');
    // Server Side (Web)
    if (this.answers.type == "Web") {
      packages.prod.push('express');
      packages.prod.push('jade');
    } else if (this.answers.type == "Cordova") {
      packages.dev.push('cordova-lib');
    }
    return packages;
    // Cordova

  },
  _getNpmConfig: function() {
    return {
      name: this.answers.name,
      description: this.answers.description,
      author: this.answers.author,
      version: "0.1.0",
      license: "ISC",
      keywords: [
        "react",
        "web",
        this.answers.author
      ],
      repository: {
        type: "git",
        url: this.answers.repo
      },
      main: "server.js",
      scripts: {
        test: "gulp test",
        start: this.answers.type == "Web" ? 'node server/index.js' : 'gulp watch'
      }
    };
  },
  _initNpm: function() {
    this.fs.writeJSON("./package.json", this._getNpmConfig());
  },

  _getBowerDefaultPackages: function() {
    return {
      prod: [

      ],
      dev: [

      ]
    };
  },
  _getBowerPackages: function() {
    var packages = this._getBowerDefaultPackages();
    //Bootstrap
    if (this.answers.frameworks.indexOf('react-bootstrap') != -1 &&
        this.this.answers.bower)
      packages.prod.push('bootstrap');
    return packages;
  },
  _getBowerConfig: function() {
    return {
      name: this.answers.name,
      description: this.answers.description,
      version: "0.1.0",
      authors: this.answers.author,
      license: "ISC"
    };
  },
  _initBower: function() {
    this.fs.copyTpl(this.templatePath(this.answers.type.toLowerCase() + "/" + "bowerrc"), this.destinationPath("./.bowerrc"));
    this.fs.writeJSON("./bower.json", this._getBowerConfig());
  },

  _getReadMeConfig: function() {
    return {
      project: {
        name: this.answers.name,
        description: this.answers.description,
        author: this.answers.author
      }
    };
  },
  _initReadMe: function() {
    this.fs.copyTpl(this.templatePath("README.md"), this.destinationPath("README.md"), this._getReadMeConfig());
  },

  _initYeoman: function() {
    this.config.save();
  },

  _initGit: function() {
    spawn.sync('git', ['init']);
    spawn.sync('git', ['commit', '--allow-empty', '-m', 'initial commit']);
    this.fs.copyTpl(this.templatePath(this.answers.type.toLowerCase() + "/" + "gitignore"), this.destinationPath("./.gitignore"));
    if (this.answers.repository != "")
      spawn.sync('git', ['remote', 'add', 'origin', this.answers.repository]);
  },
  _makeCommits: function() {
    if (this.git) {
      if (this.answers.basebranch) {
        spawn.sync('git', ['checkout', '-b', 'base-project']);
      }
      spawn.sync('git', ['add', '.gitignore']);
      spawn.sync('git', ['commit', '-m', '.gitignore']);
      spawn.sync('git', ['add', '.']);
      spawn.sync('git', ['commit', '-m', 'base project']);
      if (this.answers.basebranch) {
        spawn.sync('git', ['checkout', 'master']);
        spawn.sync('git', ['merge', 'base-project', '--no-ff']);
      }
      if (this.answers.repository)
        spawn.sync('git', ['push', 'origin', 'master']);
    }
  },

  _initGulp: function() {
    this.fs.copyTpl(this.templatePath(this.answers.type.toLowerCase() + "/" + "gulpfile.js"), this.destinationPath("./gulpfile.js"));
  },

  _initKarma: function() {
    this.fs.copyTpl(this.templatePath("karma.conf.js"), this.destinationPath("./karma.conf.js"));
  },

  _initFlow: function() {
    this.fs.copyTpl(this.templatePath("flowconfig"), this.destinationPath("./.flowconfig"));
  },

  _makeCommonFolders: function() {
    // create lib folder
    fs.mkdirSync(this.destinationPath("./lib"));
    // create flux folders
    fs.mkdirSync(this.destinationPath("./lib/actions"));
    fs.mkdirSync(this.destinationPath("./lib/components"));
    fs.mkdirSync(this.destinationPath("./lib/dispatchers"));
    fs.mkdirSync(this.destinationPath("./lib/stores"));
    fs.mkdirSync(this.destinationPath("./lib/routes"));
    // create content folders
    fs.mkdirSync(this.destinationPath("./lib/assets"));
    fs.mkdirSync(this.destinationPath("./lib/styles"));
    // create specs folders
    fs.mkdirSync(this.destinationPath("./specs"));
    fs.mkdirSync(this.destinationPath("./specs/unit"));
    fs.mkdirSync(this.destinationPath("./specs/e2e"));
    // create config folder
    fs.mkdirSync(this.destinationPath("./configs"));
    // create dist folder
    fs.mkdirSync(this.destinationPath("./dist"));
  },

  _writeFlux: function() {
    this.fs.copyTpl(this.templatePath("App.jsx"), this.destinationPath("./lib/components/App.jsx"));
    this.fs.copyTpl(this.templatePath("dispatchers/dispatcher.js"), this.destinationPath("./lib/dispatchers/dispatcher.js"));
    this.fs.copyTpl(this.templatePath(this.answers.type.toLowerCase() + "/" + "index.jsx"), this.destinationPath("./lib/index.jsx"));
    this.fs.copyTpl(this.templatePath("routes/index.jsx"), this.destinationPath("./lib/routes/index.jsx"));
  },

  _writeStyles: function() {
    this.fs.copyTpl(this.templatePath("style.scss"), this.destinationPath("./lib/styles/style.scss"));
  },

  _writeWebSpecific: function() {
    fs.mkdirSync(this.destinationPath("./lib/server"));
    fs.mkdirSync(this.destinationPath("./lib/views"));
    this.fs.copyTpl(this.templatePath("web/Vagrantfile"), this.destinationPath("./Vagrantfile"));
    this.fs.copyTpl(this.templatePath("web/Dockerfile"), this.destinationPath("./Dockerfile"));
    this.fs.copyTpl(this.templatePath("web/views/index.jade"), this.destinationPath("./lib/views/index.jade"));
    this.fs.copyTpl(this.templatePath("web/server/index.jsx"), this.destinationPath("./lib/server/index.js"));
  },

  _initCordova: function() {
    spawn.sync('cordova', ['create', this.answers.name, this.answers.cordovaPackage, this.answers.cordovaDisplayText]);
    this.destinationRoot(this.destinationPath(this.answers.name));
    spawn.sync('cordova', ['platform', "add", "browser", "--usegit"]);
  },
  _writeCordovaSpecific: function() {
    this.fs.copyTpl(this.templatePath("cordova/index.html"), this.destinationPath("./lib/index.html"));
  },

  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);
  },
  initializing: function() {

  },
  prompting: function () {
    var done = this.async();
    this.prompt(this._getQuestions(), function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
  },
  configuring: function() {

  },
  default: function() {

  },
  writing: function() {
    if (this.answers.type == "Cordova")
      this._initCordova();
    this._initGit();
    this._initNpm();
    if (this.answers.bower)
      this._initBower();
    this._makeCommonFolders();
    this._initGulp();
    this._initKarma();
    this._initFlow();
    this._initReadMe();
    this._initYeoman();
    this._writeFlux();
    this._writeStyles();
    if (this.answers.type == "Web")
      this._writeWebSpecific();
    else if (this.answers.type == "Cordova")
      this._writeCordovaSpecific();
    this._makeCommits();
  },
  conflicts: function() {

  },
  install: function() {
    var npmPackages = this._getNpmPackages();
    this.npmInstall(npmPackages.prod, {'save': true});
    this.npmInstall(npmPackages.dev, {'saveDev': true});
    if (this.answers.bower) {
      var bowerPackages = this._getBowerPackages();
      this.bowerInstall(bowerPackages.prod, {'save': true});
      this.bowerInstall(bowerPackages.dev, {'saveDev': true});
    }
  },
  end: function() {

  }
});
