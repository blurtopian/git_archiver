const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { SimpleClonerTask } = require('../cloner/SimpleClonerTask');
const { searchRandomRepo } = require('./github');
const fs = require('fs');

class Submission {
  constructor() {}

  async task(round) {
    try {
      console.log('task called with round', round);
      const randomRepo = await searchRandomRepo();
      console.log('randomRepo.clone_url', randomRepo.clone_url)
      const gitTask = new SimpleClonerTask(randomRepo);
      await gitTask.clone();
      await gitTask.zipRepo();

      return 'Done';
    } catch (err) {
      console.error('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  async submitTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      const submission = await this.fetchSubmission(roundNumber);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );

      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async storeFile(data, filename = 'dealsData.json') {
    const basePath = await namespaceWrapper.getBasePath();
    try {
      const client = new KoiiStorageClient();
      fs.writeFileSync(`${basePath}/${filename}`, JSON.stringify(data));

      const userStaking = await namespaceWrapper.getSubmitterAccount();
      const { cid } = await client.uploadFile(`${basePath}/${filename}`,userStaking);

      console.log(`Stored file CID: ${cid}`);
      fs.unlinkSync(`${basePath}/${filename}`);

      return cid;
    } catch (error) {
      console.error('Failed to upload file to IPFS:', error);
      fs.unlinkSync(`${basePath}/${filename}`);
      throw error;
    }
  }

  async fetchSubmission(round) {
    console.log('fetchSubmission called with round', round);
    const cid = await namespaceWrapper.storeGet('cid');
    console.log('cid', cid);
    return cid;
  }
}

const submission = new Submission();
module.exports = { submission };
