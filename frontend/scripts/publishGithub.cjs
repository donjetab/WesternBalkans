// Temporary preview publisher. Batch file removal for Windows command-line limits.
const ghpages = require('gh-pages');
const Git = require('gh-pages/lib/git');
const remove = Git.prototype.rm;
Git.prototype.rm = async function (files) {
  for (let index = 0; index < files.length; index += 25) {
    await remove.call(this, files.slice(index, index + 25));
  }
  return this;
};
ghpages.publish('dist', {}, (error) => {
  if (error) {
    console.error(error.message);
    process.exitCode = 1;
  } else {
    console.log('Published');
  }
});
