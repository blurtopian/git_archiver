const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const { gitTask } = require('./GitTask');

class Audit {
  async validateNode(submission_value, round) {
    try {
      return gitTask.retrieveAndValidateFile(submission_value);
    } catch (e) {
      console.log('Error in validate:', e);
      console.log('Error in validate:', e);
      return false;
    }
  }

  async auditTask(roundNumber) {
    console.log('auditTask called with round', roundNumber);
    console.log(
      await namespaceWrapper.getSlot(),
      'current slot while calling auditTask',
    );
    await namespaceWrapper.validateAndVoteOnNodes(
      this.validateNode,
      roundNumber,
    );
  }
}
const audit = new Audit();
module.exports = { audit };
