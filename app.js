const mdlinks = require('./index');

mdlinks('./test/test-dir/A/archivoB.md', {validate : true}).then(result => {
    console.log(result.filter(r => r.ok === false).length)
  console.log(result);
  console.log(result.length);
});
