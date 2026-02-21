const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// CHANGE THIS to your allowed base directory
const BASE_ALLOWED_PATH = path.resolve('./deployments');

function isPathSafe(targetPath) {
  const resolved = path.resolve(targetPath);
  return resolved.startsWith(BASE_ALLOWED_PATH);
}

app.post('/deploy', upload.single('file'), async (req, res) => {
  try {
    const zipFile = req.file;
    const targetPath = req.body.path;

    if (!zipFile || !targetPath) {
      return res.status(400).json({ error: 'Zip file and path are required.' });
    }

    if (!isPathSafe(targetPath)) {
      return res.status(403).json({ error: 'Target path not allowed.' });
    }

    const resolvedTarget = path.resolve(targetPath);
    await fs.ensureDir(resolvedTarget);

    const tempDir = path.join(os.tmpdir(), uuidv4());
    await fs.ensureDir(tempDir);

    const zipTempPath = path.join(tempDir, 'upload.zip');
    await fs.writeFile(zipTempPath, zipFile.buffer);

    const created = [];
    const overwritten = [];
    const failed = [];

    await fs.createReadStream(zipTempPath)
      .pipe(unzipper.Parse())
      .on('entry', async (entry) => {
        const entryPath = entry.path;

        if (entryPath.includes('..')) {
          entry.autodrain();
          return;
        }

        const fullDestPath = path.join(resolvedTarget, entryPath);

        if (entry.type === 'Directory') {
          await fs.ensureDir(fullDestPath);
          entry.autodrain();
          return;
        }

        try {
          await fs.ensureDir(path.dirname(fullDestPath));
          const exists = await fs.pathExists(fullDestPath);

          await new Promise((resolve, reject) => {
            entry
              .pipe(fs.createWriteStream(fullDestPath))
              .on('finish', resolve)
              .on('error', reject);
          });

          if (exists) overwritten.push(fullDestPath);
          else created.push(fullDestPath);

        } catch (err) {
          failed.push({ file: fullDestPath, error: err.message });
        }
      })
      .promise();

    await fs.remove(tempDir);

    res.json({
      status: "completed",
      created,
      overwritten,
      failed
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Deploy server running on http://localhost:${PORT}`);
});
