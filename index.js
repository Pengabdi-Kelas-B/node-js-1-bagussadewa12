const app = require('./app');
const args = process.argv.slice(2); // Mengambil argumen dari command line

if (args[0] === 'make-folder') {
  app.makeFolder();
} else if (args[0] === 'make-file') {
  app.makeFile();
} else if (args[0] === 'ext-sorter') {
  app.extSorter();
} else if (args[0] === 'read-folder') {
  app.readFolder();
} else if (args[0] === 'read-file') {
  // Menambahkan penanganan untuk read-file
  app.readFile();
} else {
  console.log('Perintah tidak dikenali. Gunakan make-folder, make-file, ext-sorter, read-folder, atau read-file.');
}
