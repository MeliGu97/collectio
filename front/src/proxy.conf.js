const PROXY_CONFIG = {
  "/api/*": {
    "target": "https://localhost:443",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" },
    "cookieDomainRewrite": "localhost:4200",
    "onProxyRes": function(proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    }
  }
}
module.exports = PROXY_CONFIG;

/*
// a mettre dans angular.json si besoin du proxy
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "buildTarget": "collectio:build",
            "proxyConfig": "src/proxy.conf.js"
            },
 */