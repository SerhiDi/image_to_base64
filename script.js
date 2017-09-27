'use strict';
let fs = require('fs');

let folder = process.argv[2];
let jsonName = process.argv[3];

fs.readdir(folder, (err, files) => {
  let obj = {};
  let trigger = false;

  files.map((file, index) => {
    let res = file.match(/([\w-]+)\.(jpe?g|png|gif|tiff)$/);

    if (res) {
      let str = res[1];
      trigger = true;
      fs.readFile(`${folder}/${file}`, function (err, content) {
        obj[str] = `data:image/${res[2]};base64,${content.toString('base64')}`;

        if (index === files.length - 1) {
          fs.writeFile(jsonName, JSON.stringify(obj), function (err) {
            if (err) {
              console.log(`File "${jsonName}" does not exist`);
            } else {
              console.log(`${Object.keys(obj).length} files written:`);
              Object.keys(obj).forEach((image, i) => {
                console.log(`${i + 1} - ${image}`);
              })
            }
          });
        }

        if (err) {
          console.log(`File "${folder}/${file}" does not exist`);
        }
      });
    }
  });

  if (!trigger && files.length) {
    console.log(`Folder "${folder}" does not exist any images`);
  }
  if (!files.length) {
    console.log(`Folder "${folder}" is empty`)
  }
  if (err) {
    console.log(`Folder "${folder}" does not exist`);
  }
});
