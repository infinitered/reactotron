// Temp script to copy index.html to the required directory
// This is just short term until we use webpack or similar.

const fs = require('fs');

const copyIndex = dir => {
  if (fs.existsSync(`${dir}`)) {
    console.log(`${dir} EXISTS - COPYING INDEX`)

    if (fs.existsSync(`${dir}/index.html`)) {
      console.log('PREVIOUS VERSION FOUND, REMOVING');

      fs.unlinkSync(`${dir}/index.html`);

      if (fs.existsSync(`${dir}/index.html`)) {
        console.log(`FILE COULD NOT BE DELETED ${dir}`);
        return false;
      }
    }

    fs.copyFileSync('src/index.html', `${dir}/index.html`);

    if (fs.existsSync(`${dir}/index.html`)) {
      console.log(`FILE COPIED TO ${dir} SUCESSFULLY`);

      return true;
    }
  }

  return false;
}

const dirsToCopyTo = [
  'build',
  'dist',
];

dirsToCopyTo.map(dir => copyIndex(dir));
