const uuidV1 = require('uuid/v1')
const path = require('path')

const self = module.exports = {

  addPhoto: (file) => {
    return new Promise((resolve, reject) =>
    {
      self.uploadFile(file, 'image').then(res => {
        self.insertFile('image', res.path, res.name).then((row) =>
        {
          resolve(row)
        }, reject)
      }, reject)
    })
  },

  addVideo: (file) => {
    return new Promise((resolve, reject) =>
    {
      self.uploadFile(file, 'video').then((res) => {
        self.insertFile('video', res.path, res.name).then((row) =>
        {
          resolve(row)
        }, reject)
      }, reject)
    })
  },

  insertFile: (type='image', path, name) => {
    return new Promise((resolve, reject) =>
    {
      File.create({
          type: type,
          path: path,
          name: name,
        }).exec(function (err, row) {
          if (err) {
            reject('file not insert')
          }
          resolve(row)
        })
    })
  },

  uploadFile: (files, type='image') => {
    return new Promise((resolve, reject) =>
    {
      var filePath = 'data/'+type
      var filePathFinal = path.resolve(sails.config.appPath, `assets/${filePath}`)
      var fileName = uuidV1()
      var fileExt

      files.upload({
				saveAs:function(file, next) {
					fileExt = file.filename.split('.').pop()
					return next(undefined, filePathFinal+'/'+fileName+'.'+fileExt)
				},
			}, (err, uploadedFiles) => {
				if (err) return reject(err)

        if(uploadedFiles.length > 0) return resolve({
          path: '/'+type+'/',
          name: fileName+'.'+fileExt,
          size: uploadedFiles[0].size
        })
        
        return reject('file not upload')
			})
    })
  },
}