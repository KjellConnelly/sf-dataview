const path = require('path')
const { writeFile, readFile, readdir, mkdir, unlink, stat } = require('fs/promises')

class Helper {
  static async readdir(inputPath) {
    try {
      let filenames = await readdir(inputPath)
      if (filenames) {
        filenames.sort()
      }
      return filenames
    } catch(err) {
      console.error(err)
    }
  }

  static async getJSONObj(inputPath) {
    try {
      let str = await readFile(inputPath)
      if (str) {
        let obj = JSON.parse(str)
        return obj
      }
      return null
    } catch(err) {
      console.error(err)
    }
  }

  static async getAccountNamesAndFilenames(inputPath) {
    try {
      let files = await readdir(inputPath)
      if (files) {
        files.sort()
      }

      let toReturn = []

      for (let i = 0; i < files.length; i++) {
        let filepath = path.join(inputPath, files[i])
        let fileStr = await readFile(filepath, "utf-8")
        let obj = JSON.parse(fileStr)
        let accountname = obj["Household Detail"]["Household Title & Net Worth (REQUIRED)"]["Account Name"]
        toReturn.push({
          name: accountname,
          filename: files[i]
        })
      }
      return toReturn
    } catch(err) {
      console.error(err)
    }
  }

  static async getFullAccountsAndFilenames(inputPath) {
    try {
      let files = await readdir(inputPath)
      if (files) {
        files.sort()
      }

      let toReturn = []

      for (let i = 0; i < files.length; i++) {
        let filepath = path.join(inputPath, files[i])
        let fileStr = await readFile(filepath, "utf-8")
        let obj = JSON.parse(fileStr)
        let accountname = obj["Household Detail"]["Household Title & Net Worth (REQUIRED)"]["Account Name"]
        toReturn.push({
          name: accountname,
          filename: files[i],
          obj:obj
        })
      }
      return toReturn
    } catch(err) {
      console.error(err)
    }
  }

}

module.exports = Helper
