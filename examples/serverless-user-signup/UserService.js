
const AWS = require('aws-sdk')

module.exports = class UserService {
  constructor(env) {
    console.info("UserService", !!env.IS_OFFLINE, env.AWS_REGION);
    this.db = new AWS.DynamoDB()
  }

  async get(id) {
    console.debug(`get user:${id}`);
    return {
      user: {
        id
      }
    };
  }

  async add(email) {
    console.debug(`add user with email ${email}`);
    this._ids += 1
    return {
      success: true,
      user: {
        id: this._ids,
        email
      }
    };
  }
};
