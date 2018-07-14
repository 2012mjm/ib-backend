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

  'POST /api/v1/manager/signup':        'Manager.signup',
  'POST /api/v1/manager/login':         'Manager.login',
  
  'POST /api/v1/store/signup':          'Store.signup',
  'POST /api/v1/store/login':           'Store.login',
  'GET /api/v1/stores':                 'Store.list',
  'GET /api/v1/stores/panel':           'Store.listPanel',
  'GET /api/v1/store':                  'Store.info',
  'GET /api/v1/store/panel':            'Store.infoPanel',
  'PUT /api/v1/store':                  'Store.edit',
  'DELETE /api/v1/store':               'Store.delete',
  'DELETE /api/v1/store/force':         'Store.deleteForce',

  'POST /api/v1/category':              'Category.add',
  'GET /api/v1/categories':             'Category.list',
  'GET /api/v1/categories/panel':       'Category.listPanel',
  'PUT /api/v1/category':               'Category.edit',
  'DELETE /api/v1/category':            'Category.delete',
  'POST /api/v1/category/attribute':    'Category.addAttribute',

  'POST /api/v1/product':               'Product.add',
  'GET /api/v1/products':               'Product.list',
  'GET /api/v1/products/panel':         'Product.listPanel',
  'GET /api/v1/product':                'Product.info',
  'GET /api/v1/product/panel':          'Product.infoPanel',
  'PUT /api/v1/product':                'Product.edit',
  'DELETE /api/v1/product':             'Product.delete',
  'DELETE /api/v1/product/force':       'Product.deleteForce',
  'POST /api/v1/product/photo':         'Product.addPhoto',
  'DELETE /api/v1/product/photo':       'Product.deletePhoto',
  'POST /api/v1/product/attribute':     'Product.addAttribute',

  'POST /api/v1/customer':              'Customer.add',
  'POST /api/v1/customer/login':        'Customer.login',
  'POST /api/v1/customer/verify-code':  'Customer.verifyCode',
  'GET /api/v1/customers/panel':        'Customer.listPanel',

  'POST /api/v1/order':                 'Order.add',

  'GET /api/v1/invoices':               'Invoice.list',

  'POST /api/v1/attribute':               'Attribute.add',
  'POST /api/v1/attribute/value':         'Attribute.addValue',
  'GET /api/v1/attributes':               'Attribute.list',
  'GET /api/v1/attribute':                'Attribute.info',
  'PUT /api/v1/attribute':                'Attribute.edit',
  'DELETE /api/v1/attribute':             'Attribute.delete',
};
