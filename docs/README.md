# ------------ FOR MIGRATION --------------------

# npm install global package
npm install -g grunt-cli
npm install -g db-migrate-mysql

# create migration
grunt db:migrate:create --name=init --force --sql-file

# run migration
grunt db:migrate:up


# ------------ FOR GENERATE AUTO MODEL --------------------

# npm install global package
npm install -g sails-generate-models

# generate all
sails-generate-models --connection=someMysqlServer

# generate just x table
sails-generate-models --connection=someMysqlServer --table=tp_user


# ------------like DIE in php --------------------
process.exit();

# ------------ UPGRADE MYSQL ---------------------------
mysql_upgrade -u root -p --force

# ------------ SAILS LOG ---------------------------
sails.log.warn('Error:', err);
sails.log.info('OK:', res);

# ------------ IS NOT SOCKET REQUEST -------------
if (!req.isSocket) { ...

# ------------- LOCAL JS ----------------------
add empty file: config/local.js
