const _ = require('lodash')

const self = module.exports = {

  mergeSimilar: (list) => {
    newList = []
    list.forEach(item => {
      index = newList.findIndex(i => i.id === item.id)
      if(index === -1) {
        newList.push(item)
      } else {
        _.mergeWith(newList[index], item, (objValue, srcValue, key) => {
          return /^\[.*?\]/.test(key) ? _.concat(objValue, srcValue) : objValue
        })
      }
    })
    return newList
  },

  mergeRelation: (list) => {
    newList = []
    list.forEach(item => {
      newItem = {}
      for(let key in item) {
        matchArr = key.match(/^\[(.*?)\]\.(.*?)$/i)
        matchObj = key.match(/^(.*?)\.(.*?)$/i)

        if(matchArr) {
          secondItem = []
          if(_.isArray(item[key])) {
            secondItem = item[key].map(i => {
              x = {}
              x[matchArr[2]] = i
              return x
            })
          }
          if(!newItem[matchArr[1]]) {
            newItem[matchArr[1]] = []
          }
          _.merge(newItem[matchArr[1]], secondItem)
        }
        else if(matchObj) {
          obj = {}
          obj[matchObj[2]] = item[key]
          newItem[matchObj[1]] = _.merge(newItem[matchObj[1]], obj)
        }
        else {
          newItem[key] = item[key]
        }
      }
      newList.push(newItem)
    })
    return newList
  },

  removeDuplicate: (list) => {
    return list.map(item => {
      for(let key in item) {
        if(_.isArray(item[key])) {
          item[key] = _.uniq(item[key])
        }
      }
      return item
    })
  },

  removeNullId: (list) => {
    newList = []
    list.forEach(item => {
      newItem = {}
      for(let key in item) {
        if(_.isArray(item[key])) {
          newItem[key] = []
          item[key].forEach(i => {
            if(!(i.id !== undefined && i.id === null)) {
              newItem[key].push(i)
            }
          })
        } else {
          newItem[key] = item[key]
        }
      }
      newList.push(newItem)
    })
    return newList
  },

  checkObjLevel2: (list) => {
    return list.map(item => {
      for(let key in item) {
        if(_.isPlainObject(item[key]) && item[key] !== {}) {
          newItem = self.removeNullId(self.removeDuplicate(self.mergeRelation(self.mergeSimilar([item[key]]))))[0]
          item[key] = newItem
        }
      }
      return item
    })
  },

  checkObjLevel3: (list) => {
    return list.map(item => {
      for(let key in item) {
        if(_.isPlainObject(item[key]) && item[key] !== {}) {
          item[key] = self.checkArrLevel2([item[key]])[0]
        }
      }
      return item
    })
  },

  checkArrLevel2: (list) => {
    return list.map(item => {
      for(let key in item) {
        if(_.isArray(item[key]) && item[key].length > 0) {
          newItem = self.checkObjLevel2(self.removeNullId(self.removeDuplicate(self.mergeRelation(self.mergeSimilar(item[key])))))
          item[key] = newItem
        }
      }
      return item
    })
  },

  checkArrLevel3: (list) => {
    return list.map(item => {
      for(let key in item) {
        if(_.isArray(item[key]) && item[key].length > 0) {
          item[key] = self.checkArrLevel2(item[key])
        }
      }
      return item
    })
  },

  checkArrLevel4: (list) => {
    return list.map(item => {
      for(let key in item) {
        if(_.isArray(item[key]) && item[key].length > 0) {
          item[key] = self.checkArrLevel3(item[key])
        }
      }
      return item
    })
  },

  ORM: (list) => {
    list = self.mergeSimilar(list)
    list = self.mergeRelation(list)

    list = self.removeDuplicate(list)
    list = self.removeNullId(list)

    list = self.checkObjLevel2(list)
    list = self.checkObjLevel3(list)

    list = self.checkArrLevel2(list)
    list = self.checkArrLevel3(list)
    list = self.checkArrLevel4(list)
    return list
  },

  // list = []
  // for(let i=0; i<rows.length; i++)
  // {
  //   row = rows[i]
  //   if(!list[row.id]) list[row.id] = {}

  //   for(let k=0; k<Object.keys(row).length; k++) {
  //     key = Object.keys(row)[k]
  //     val = row[key]

  //     if(key.split('.').length === 2) {
  //       keys = key.split('.')

  //       if(list[row.id][keys[0]] === undefined) {
  //         if(keys[1] === 'id') {
  //           list[row.id][keys[0]] = []
  //           list[row.id][keys[0]][val] = {
  //             id: val
  //           }
  //         }
  //         else {
  //           list[row.id][keys[0]] = {}
  //           list[row.id][keys[0]][keys[1]] = val  
  //         }
  //       }
  //       else {
  //         if(Array.isArray(list[row.id][keys[0]]) && val) {
  //           if(keys[1] === 'id') {
  //             list[row.id][keys[0]][val] = {
  //               id: val
  //             }
  //           } else {
  //             lastIndex = list[row.id][keys[0]].length-1
  //             list[row.id][keys[0]][lastIndex][keys[1]] = val
  //           }
  //         }
  //         else {
  //           list[row.id][keys[0]][keys[1]] = val
  //         }
  //       }
  //     }
  //     else {
  //       list[row.id][key] = val
  //     }
  //   }
  // }
  // return self.cleanORM(list)

    // cleanORM: (list) => {
    //     for (let i=0; i<list.length; i++) {
    //         if (list[i] === undefined) {
    //           list.splice(i, 1)
    //           i--
    //           continue
    //         }
  
    //         for(let key in list[i]) {
    //           if(Array.isArray(list[i][key])) {
    //             for (let j=0; j<list[i][key].length; j++) {
    //               if (list[i][key][j] === undefined) {
    //                 list[i][key].splice(j, 1)
    //                 j--
    //                 continue
    //               }
    //             }
    //           }
    //         }
    //     }
    //     return list
    // }
}