class Login {
    constructor(requestId, responseId, request, response, user) {
        this.requestId = requestId;
        this.responseId = responseId;
        this.request = request;
        this.response = response;
        this.user = user;
    }
  }

  module.exports = Login;