/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': {
  //   view: 'homepage'
  // }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  'POST /api/v1/manager/signup':    'Manager.signup',
  'POST /api/v1/manager/login':     'Manager.login',
  
  'POST /api/v1/store/signup':      'Store.signup',
  'POST /api/v1/store/login':       'Store.login',
  'GET /api/v1/store':              'Store.list',
  'GET /api/v1/store/list-panel':   'Store.listPanel',

  'POST /api/v1/category':          'Category.add',
  'GET /api/v1/category':           'Category.list',
  'PUT /api/v1/category':           'Category.edit',
  'DELETE /api/v1/category':        'Category.delete',

  'POST /api/v1/product':           'Product.add',
  'POST /api/v1/product/photo':     'Product.addPhoto',
  'GET /api/v1/product':            'Product.list',
  'GET /api/v1/product/list-panel': 'Product.listPanel',

  'POST /api/v1/customer':              'Customer.add',
  'POST /api/v1/customer/login':        'Customer.login',
  'POST /api/v1/customer/verify-code':  'Customer.verifyCode',
  'GET /api/v1/customer/list-panel':    'Customer.listPanel',
};
