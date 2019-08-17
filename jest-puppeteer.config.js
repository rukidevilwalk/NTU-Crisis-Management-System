/* Author(s): Neo Kee Pin */
module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
  },
  browserContext: 'default',
}
