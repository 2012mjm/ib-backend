var moment = require('moment');

var self = module.exports = {

  getLast: (visitorId, count=10) => {
    return new Promise((resolve, reject) =>
    {
      Message.find()
        .where({visitorId: visitorId})
        .populate('userId')
        .sort('id DESC')
        .limit(10)
        .exec((err, rows) => {
          if (err && rows.length == 0) {
            return reject('message not found');
          }

          var list = [];
          rows.reverse().forEach((row) => {
            list.push({
              id: row.id,
              text: row.text,
              status: row.status,
              createdAt: row.createdAt,
              self: (row.userId == null),
              user: (row.userId && row.userId.username) ? row.userId.username : null
            });
          });

          resolve(list);
        });
    });
  },

  getLastByVisitorId: (visitorId, userId, count=10) => {
    return new Promise((resolve, reject) =>
    {
      var query = 'SELECT m.id, m.text, m.status, m.createdAt, u.username FROM `visitor` `v` \
        INNER JOIN `message` `m` ON m.visitorId = v.id \
          LEFT JOIN `user` `u` ON u.id = m.userId \
        INNER JOIN `account` `a` ON v.accountId = a.id \
          INNER JOIN `account_user` `au` ON au.accountId = a.id AND au.userId = ? \
        WHERE v.id = ? \
        ORDER BY m.id DESC \
        LIMIT ?';

      Visitor.query(query, [userId, visitorId, count], (err, rows) => {
        if (err || rows.length == 0) {
          return reject('message not found');
        }

        var list = [];
        rows.reverse().forEach((row) => {
          list.push({
            id: row.id,
            text: row.text,
            status: row.status,
            createdAt: row.createdAt,
            user: row.username,
            sendByVisitor: (row.username == null)
          });
        });

        resolve(list);
      });
    });
  },

  sendByVisitor: (visitorId, text, status='unread') => {
    return new Promise((resolve, reject) =>
    {
        Message.create({
  				visitorId: visitorId,
          text: text,
          status: status,
  				createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
  			}).exec(function (err, row) {
  				if (err) {
            return reject('message not insert');
  				}

          VisitorService.updateLastMessageId(visitorId, row.id);
          resolve(row);
  			});
			});
  },

  sendByUser: (userId, visitorId, text, status='unread') => {
    return new Promise((resolve, reject) =>
    {
      Message.create({
        visitorId: visitorId,
				userId: userId,
        text: text,
        status: status,
				createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
			}).exec(function (err, row) {
				if (err) {
          return reject('message not insert');
				}

        VisitorService.updateLastMessageId(visitorId, row.id);
        resolve(row);
			});
    });
  },

  updateStatusByIdsForVisitor: (visitorId, messagesId, status='read') => {
    return new Promise((resolve, reject) =>
    {
      Message.update({id: messagesId, visitorId: visitorId, userId: {'!': null}}, {status: status}).exec((err, updated) => {
				if (err) {
          reject('messages not update');
				}
        resolve(updated);
			});
    });
  },

  updateStatusByIdsForUser: (userId, messagesId, status='read') => {
    return new Promise((resolve, reject) =>
    {
      var query = 'UPDATE `message` `m` \
          LEFT JOIN `visitor` `v` ON `v`.`id` = `m`.`visitorId` \
              LEFT JOIN `account` `a` ON `a`.`id` = `v`.`accountId` \
                  LEFT JOIN `account_user` `au` ON `a`.`id` = `au`.`accountId` \
        SET `m`.`status` = ? \
        WHERE `m`.`id` IN (?) AND `au`.`userId` = ? AND `m`.`userId` IS NULL';

      Message.query(query, [status, messagesId, userId], (err, updated) => {
        if (err || updated.changedRows <= 0) {
          return reject('message not update');
        }

        resolve(updated.changedRows);
			});
    });
  },
}
