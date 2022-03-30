const fuzzysort = require('fuzzysort')
const Helper = require('./Helper.js')

class SearchHelper {
  static async createCachedSearchData(inputPath) {
    try {
      let allData = await Helper.getFullAccountsAndFilenames(inputPath)

      let cachedSearchData = allData.map(fullAccountAndFilename=>{
        let hh = fullAccountAndFilename.obj
        let toReturn = {}
        let rows = Object.keys(hh).map(key=>hh[key])
        toReturn.name = rows[0]["Household Title & Net Worth (REQUIRED)"]["Account Name"]
        toReturn.inactive = rows[0]["Household Title & Net Worth (REQUIRED)"]["Active Status"] == "No" ? "inactive" : "active"
        toReturn.ein = rows[0]["Household Title & Net Worth (REQUIRED)"]["EIN #"]
        toReturn.owner = rows[0]["Household Relationships (REQUIRED)"]["Account Owner"]
        toReturn.advisor = rows[0]["Household Relationships (REQUIRED)"]["Primary Advisor"]
        toReturn.contacts = Object.keys(rows[1]).join(", ")
        toReturn.contactsRelated = Object.keys(rows[2]).join(", ")
        toReturn.financialAccounts = Object.keys(rows[3]).join(", ")
        toReturn.deceased = Object.keys(rows[1]).map(contactStr=>{
  	return rows[1][contactStr]["Contact Information (REQUIRED)"]["Deceaseds"] ? "deceased" : ""
        }).filter(s=>s.length > 0).join(", ")
        toReturn.openActivities = Object.keys(rows[4]).map(key=>{
          return "openActivities"
        }).join(", ")
        toReturn.filename = fullAccountAndFilename.filename
        return toReturn
      })

      // now we turn it into strings
      cachedSearchData = cachedSearchData.map(d=>JSON.stringify(d))

      return cachedSearchData
    } catch(err) {
      console.error(err)
    }
  }

  static async search(str = "", cachedSearchData) {

    try {
      let results = fuzzysort.go(str, cachedSearchData, {
        threshold: -1300,
      })


      // need to return names and what not.... not the fuzzysearch results
      //console.log(JSON.stringify(results,null,2))

      return results
    } catch(err) {
      console.error(err)
    }
  }
}

module.exports = SearchHelper

// string search: name, ein, owner, advisor,
//                contacts/contacts related name, financial accounts
// specific values: inactive, deceased, openActivities
