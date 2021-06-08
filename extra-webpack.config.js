const path = require('path')

module.exports = {
    resolve: {
        fallback: {
            https: path.resolve(__dirname, "./node_modules/https-browserify"),
            http: path.resolve(__dirname, "./node_modules/stream-http/"),
            zlib: path.resolve(__dirname, "./node_modules/browserify-zlib/"),
            path: path.resolve(__dirname, "./node_modules/path-browserify/"),
            stream: path.resolve(__dirname, "./node_modules/stream-browserify/"),
            crypto: path.resolve(__dirname, "./node_modules/crypto-browserify/"),
        }
    }
}