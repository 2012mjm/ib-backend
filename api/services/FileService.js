var uuidV1 = require('uuid/v1');
var path = require('path');

var self = module.exports = {

  addPhoto: (userId, file) => {
    return new Promise((resolve, reject) =>
    {
      self.uploadFile(file, 'image').then((res) => {
        self.insertFile(userId, 'image', res.path, res.name, res.size).then((row) =>
        {
          resolve(row);
        }, reject);
      }, reject);
    });
  },

  insertFile: (type='image', path, name) => {
    return new Promise((resolve, reject) =>
    {
      Filemanager.create({
          type: type,
          path: path,
          name: name
        }).exec(function (err, row) {
          if (err) {
            reject('file not insert');
          }
          resolve(row);
        });
    });
  },

  uploadFile: (files, type='photo') => {
    return new Promise((resolve, reject) =>
    {
      var filePath = 'data/'+type;
      var filePathFinal = path.resolve(sails.config.appPath, filePath);
      var fileName = uuidV1();
      var fileExt;

      files.upload({
				saveAs:function(file, next) {
					fileExt = file.filename.split('.').pop();
					return next(undefined, filePathFinal+'/'+fileName+'.'+fileExt);
				},
			}, (err, uploadedFiles) => {
				if (err) return reject(err);

        if(uploadedFiles.length > 0) return resolve({
          path: '/'+filePath+'/',
          name: fileName+'.'+fileExt,
          size: uploadedFiles[0].size
        });
        
        return reject('file not upload');
			});
    });
  },
}