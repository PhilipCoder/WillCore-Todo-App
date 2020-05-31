const baseProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler.js");

class actionModelProxyHandler extends baseProxyHandler {
  constructor(assignable) {
    super(assignable);
    this.changedStateValues = {};
    this.isRecording = false;

    this.getTraps.unshift(this.getStateValues);
    this.getTraps.unshift(this.getRecordingFunction);
    this.setTraps.unshift(this.assignValue);
  }

  assignValue(target, property, value, proxy) {
    if (this.isRecording) {
      this.changedStateValues[property] = value;
    }
    return { value: value, status: true };
  }

  getRecordingFunction(target, property) {
    if (property === "record") {
      return {
        status: true, value: (shouldRecord) => {
          this.isRecording = shouldRecord === undefined ? true : shouldRecord;
        }
      };
    }
    return { status: false };
  }

  getStateValues(target, property) {
    if (property === "stateValues") {
      return { status: true, value: this.changedStateValues };
    }
    return { status: false };
  }
}

module.exports = actionModelProxyHandler;