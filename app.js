const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// Fungsi untuk membuat folder
app.makeFolder = () => {
  rl.question('Masukkan Nama Folder: ', (folderName) => {
    fs.mkdir(path.join(__dirname, folderName), { recursive: true }, (err) => {
      if (err) {
        console.log('Gagal membuat folder:', err.message);
      } else {
        console.log(`Folder '${folderName}' berhasil dibuat.`);
      }
      rl.close();
    });
  });
};

// Fungsi untuk membuat file baru
app.makeFile = () => {
  rl.question('Masukkan Nama File: ', (fileName) => {
    rl.question('Masukkan Isi File: ', (content) => {
      fs.writeFile(path.join(__dirname, fileName), content, (err) => {
        if (err) {
          console.log('Gagal membuat file:', err.message);
        } else {
          console.log(`File '${fileName}' berhasil dibuat dengan isi: ${content}`);
        }
        rl.close();
      });
    });
  });
};

// Fungsi untuk mengatur file berdasarkan ekstensi ke dalam subfolder
app.extSorter = () => {
  const sourceFolder = path.join(__dirname, 'unorganize_folder');
  fs.readdir(sourceFolder, (err, files) => {
    if (err) {
      console.log('Gagal membaca folder:', err.message);
      return rl.close();
    }

    files.forEach((file) => {
      const ext = path.extname(file).slice(1);
      if (!ext) return; // Abaikan file tanpa ekstensi

      // Tentukan folder ekstensi di luar unorganize_folder
      const extFolder = path.join(__dirname, ext);
      fs.mkdir(extFolder, { recursive: true }, (err) => {
        if (err) {
          console.log('Gagal membuat folder ekstensi:', err.message);
          return;
        }

        const oldPath = path.join(sourceFolder, file);
        const newPath = path.join(extFolder, file);
        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.log('Gagal memindahkan file:', err.message);
          } else {
            console.log(`File '${file}' dipindahkan ke folder '${ext}'`);
          }
        });
      });
    });
    rl.close();
  });
};

// Fungsi untuk membaca isi folder dengan format yang ditentukan
app.readFolder = () => {
  rl.question('Masukkan Path Folder: ', (folderPath) => {
    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log('Gagal membaca folder:', err.message);
        return rl.close();
      }

      const details = files.map((file) => {
        const filePath = path.join(folderPath, file.name);
        const stats = fs.statSync(filePath); // Mengambil statistik file

        return {
          namaFile: file.name,
          extensi: path.extname(file.name).slice(1) || 'tidak ada', // Mengambil ekstensi
          jenisFile: file.isDirectory() ? 'folder' : path.extname(file.name).slice(1) === 'jpg' || path.extname(file.name).slice(1) === 'png' ? 'gambar' : 'text',
          tanggalDibuat: stats.birthtime.toISOString().split('T')[0], // Format tanggal
          ukuranFile: `${(stats.size / 1024).toFixed(2)}kb`, // Menghitung ukuran file dalam KB
        };
      });

      console.log(`Berhasil menampilkan isi dari folder ${folderPath}:`);
      console.log(JSON.stringify(details, null, 4)); // Mengubah objek ke format JSON dan menampilkannya
      rl.close();
    });
  });
};

// Fungsi untuk membaca isi file (hanya mendukung file teks)
app.readFile = () => {
  rl.question('Masukkan Path File: ', (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log('Gagal membaca file:', err.message);
      } else {
        console.log(`Isi dari file '${filePath}':\n${data}`);
      }
      rl.close();
    });
  });
};

module.exports = app;
