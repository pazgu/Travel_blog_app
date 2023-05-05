const webpack = require('webpack')
const dotenv = require('dotenv')

module.exports = () => {
  // call dotenv and it will return an Object with a parsed key
  const env = dotenv.config().parsed

  // create a new webpack.DefinePlugin with the parsed env object
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next])
    return prev
  }, {})

  return {
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ]
  }
}
