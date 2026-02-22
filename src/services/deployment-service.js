const os = require('os');
const path = require('path');
const { randomUUID } = require('crypto');
const fs = require('fs-extra');
const unzipper = require('unzipper');

async function writeArchiveToTemporaryLocation(uploadedArchiveFileBuffer) {
  const temporaryDirectoryPath = path.join(os.tmpdir(), randomUUID());
  const temporaryArchiveFilePath = path.join(temporaryDirectoryPath, 'deployment-package.zip');
  await fs.ensureDir(temporaryDirectoryPath);
  await fs.writeFile(temporaryArchiveFilePath, uploadedArchiveFileBuffer);
  return { temporaryDirectoryPath, temporaryArchiveFilePath };
}

async function extractArchiveToTargetDirectory({ temporaryArchiveFilePath, resolvedTargetPath }) {
  const createdFilePaths = [];
  const overwrittenFilePaths = [];
  const failedFileWrites = [];

  await fs.ensureDir(resolvedTargetPath);

  await fs.createReadStream(temporaryArchiveFilePath)
    .pipe(unzipper.Parse())
    .on('entry', async (archiveEntry) => {
      const archiveEntryPath = archiveEntry.path;
      if (archiveEntryPath.includes('..')) {
        archiveEntry.autodrain();
        return;
      }

      const destinationPath = path.join(resolvedTargetPath, archiveEntryPath);

      if (archiveEntry.type === 'Directory') {
        await fs.ensureDir(destinationPath);
        archiveEntry.autodrain();
        return;
      }

      try {
        await fs.ensureDir(path.dirname(destinationPath));
        const fileAlreadyExists = await fs.pathExists(destinationPath);

        await new Promise((resolveWrite, rejectWrite) => {
          archiveEntry
            .pipe(fs.createWriteStream(destinationPath))
            .on('finish', resolveWrite)
            .on('error', rejectWrite);
        });

        if (fileAlreadyExists) {
          overwrittenFilePaths.push(destinationPath);
        } else {
          createdFilePaths.push(destinationPath);
        }
      } catch (error) {
        failedFileWrites.push({ file: destinationPath, error: error.message });
      }
    })
    .promise();

  return { createdFilePaths, overwrittenFilePaths, failedFileWrites };
}

async function processDeployment({ uploadedArchiveFileBuffer, resolvedTargetPath }) {
  const { temporaryDirectoryPath, temporaryArchiveFilePath } =
    await writeArchiveToTemporaryLocation(uploadedArchiveFileBuffer);

  try {
    return await extractArchiveToTargetDirectory({
      temporaryArchiveFilePath,
      resolvedTargetPath
    });
  } finally {
    await fs.remove(temporaryDirectoryPath);
  }
}

module.exports = {
  processDeployment
};
