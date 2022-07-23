const PROXY = {
    "/api": {
        "target": "http://localhost:3333/",
        "secure": false,
        "logLevel": "debug"
    },
    "/images/*": {
      "target": "http://localhost:3333",
      "pathRewrite": {'^/images' : ''},
      "secure": false,
      "logLevel": "debug"
    }
}
module.exports = PROXY;
