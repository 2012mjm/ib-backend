const self = module.exports = {

    ORM: (rows) => {
        list = []
        for(let i=0; i<rows.length; i++)
        {
          row = rows[i]
          if(!list[row.id]) list[row.id] = {}

          for(let k=0; k<Object.keys(row).length; k++) {
            key = Object.keys(row)[k]
            val = row[key]

            if(key.split('.').length === 2) {
              keys = key.split('.')

              if(list[row.id][keys[0]] === undefined) {
                if(keys[1] === 'id') {
                  list[row.id][keys[0]] = []
                  list[row.id][keys[0]][val] = {
                    id: val
                  }
                }
                else {
                  list[row.id][keys[0]] = {}
                  list[row.id][keys[0]][keys[1]] = val  
                }
              }
              else {
                if(Array.isArray(list[row.id][keys[0]]) && val) {
                  if(keys[1] === 'id') {
                    list[row.id][keys[0]][val] = {
                      id: val
                    }
                  } else {
                    lastIndex = list[row.id][keys[0]].length-1
                    list[row.id][keys[0]][lastIndex][keys[1]] = val
                  }
                }
                else {
                  list[row.id][keys[0]][keys[1]] = val
                }
              }
            }
            else {
              list[row.id][key] = val
            }
          }
        }
        return self.cleanORM(list)
    },

    cleanORM: (list) => {
        for (let i=0; i<list.length; i++) {
            if (list[i] === undefined) {
              list.splice(i, 1)
              i--
              continue
            }
  
            for(let key in list[i]) {
              if(Array.isArray(list[i][key])) {
                for (let j=0; j<list[i][key].length; j++) {
                  if (list[i][key][j] === undefined) {
                    list[i][key].splice(j, 1)
                    j--
                    continue
                  }
                }
              }
            }
        }
        return list
    }
}