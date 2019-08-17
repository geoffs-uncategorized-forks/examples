const laconia = require("@laconia/core");
const UserService = require('./UserService')

class UserNotFoundError extends Error {
  constructor () {
    super('User not found')
  }
}

const responseAdditionalHeaders = {
  "x-laconia-version": require("@laconia/core/package").version
}

const instances = ({ env }) => ({
  userService: new UserService(env)
});

const get = require("@laconia/adapter-api").apigateway({
  inputType: "params",
  responseAdditionalHeaders
});

const post = require("@laconia/adapter-api").apigateway({
  inputType: "body",
  responseAdditionalHeaders
});

const apps = {
  getUser: async (input, { userService }) => {
    if (!input.id) {
      throw new UserNotFoundError()
    }
    return userService.get(input.id)
  },
  addUser: async (input, { userService }) => {
    return userService.add(input.email)
  }
}

const logger = next => async (event, context) => {
  const {
    httpMethod,
    path
  } = event
  // Log the request
  console.log(new Date().toISOString(), `[${httpMethod}]`, path);

  return new Promise((resolve, reject) => {
    next(event, context, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};


const getUser = laconia(get(apps.getUser)).register(instances);
const addUser = laconia(post(apps.addUser)).register(instances);

exports.getUser = logger(getUser);
exports.addUser = logger(addUser);
