const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const fs = require('fs');
const archiver = require('archiver');
const simpleGit = require('simple-git');
const git = simpleGit();

class SimpleClonerTask {
  constructor(repo) {
    this.repo = repo;
  }

  async clone() {
    // Create a new instance of the Koii Storage Client
    const client = new KoiiStorageClient();
    const basePath = await namespaceWrapper.getBasePath();
    const repoName = this.repo.name;
    const cloneDir = `${basePath}/${repoName}`;
    const cloneUrl = this.repo.clone_url;

    try {
      if (!fs.existsSync(cloneDir)) {
        await git.clone(cloneUrl, cloneDir);
        console.log('Repository cloned successfully.');
      } else {
        console.log('Directory already exists. Skipping clone.');
      }
      return 'Clone Done!';
    } catch (error) {
      console.error('Error fetching latest commit:', error);
    } finally {
      // Clean up: remove the temporary directory if needed
      // (Implement cleanup logic here if desired)
    }
  }

  async zipRepo() {
    const basePath = await namespaceWrapper.getBasePath();
    const repoName = this.repo.name;
    const cloneDir = `${basePath}/${repoName}`;
    const zipPath = `${cloneDir}.zip`;

    console.log(`Zipping the repository into ${zipPath}`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level
    });

    output.on('close', () => {
      console.log(
        `Repository zipped successfully. Total bytes: ${archive.pointer()}`,
      );
    });

    output.on('end', () => {
      console.log('Data has been drained');
    });

    archive.on('warning', err => {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    });

    archive.on('error', err => {
      throw err;
    });

    archive.pipe(output);

    archive.directory(cloneDir, false);

    archive.finalize();
  }

  async getLatestCommit() {
    try {
      // Clone the repository to a temporary directory (or just use a local repo)
      await git.clone(remoteUrl, 'temp-repo', ['--depth', '1']);

      // Change the working directory to the cloned repository
      git.cwd('temp-repo');

      // Get the latest commit
      const log = await git.log({ maxCount: 1 });
      console.log('Latest Commit:', log.latest);
      return log.latest;
    } catch (error) {
      console.error('Error fetching latest commit:', error);
    } finally {
      // Clean up: remove the temporary directory if needed
      // (Implement cleanup logic here if desired)
    }
  }
}

async function retrieveAndValidateFile(cid, filename = 'dealsData.json') {
  // instantiate the storage client
  const client = new KoiiStorageClient();

  try {
    // get the uploaded file using the IPFS CID we stored earlier and the filename (in this case, `dealsData.json`)
    const upload = await client.getFile(cid, filename);
    // return whether or not the file exists
    return !!upload;
  } catch (error) {
    console.error('Failed to download or validate file from IPFS:', error);
    throw error;
  }
}

module.exports = {
  SimpleClonerTask,
  retrieveAndValidateFile,
};
