var generators = require('yeoman-generator');

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
      message : 'Your component name',
    }, {
      type    : 'input',
      name    : 'filepath',
      message : 'Your file path',
      default : ""
    }, {
      type    : 'input',
      name    : 'filename',
      message : 'Your file name',
      default : function(answers) {
        return answers.name + '.jsx';
      }
    }], function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
  },
  configuring: function() {

  },
  default: function() {

  },
  writing: function() {
    // write .gitignore
    this.fs.copyTpl(this.templatePath("component.jsx"), this.destinationPath("./lib/components/" + this.answers.filepath + this.answers.filename), {
      component: {
        name: this.answers.name
      }
    });
  },
  conflicts: function() {

  },
  install: function() {

  },
  end: function() {

  }
});
