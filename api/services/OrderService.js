os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

const self = module.exports = {

  add: (cart, invoice) => {
    return new Promise((resolve, reject) =>
    {
      let result = {invoice: {}, orders: []}

      let productCount = cart.length
      result.invoice = {
        id: invoice.id,
        number: invoice.number,
        total: 0
      }
      result.receiver = {
        postal_code: invoice.postalCode,
        phone: invoice.phone,
        name: invoice.name,
        city_id: invoice.cityId,
        address: invoice.address
      }

      let count = 0
      let amount = 0
      for(let i=0; i<productCount; i++)
      {
        let item = cart[i]
        item.customer_id = invoice.customerId
        item.invoice_id = invoice.id
        self.create(item).then(({order, product}) =>
        {
          amount += order.price * order.count

          count++
          result.orders.push({
            id: order.id,
            count: order.count,
            total: order.price * order.count,
            product: {
              id: product.id,
              title: {
                fa: product.nameFa,
                en: product.nameEn
              },
              price: product.price,
              discount: product.discount,
            }
          })

          if(count >= productCount) {
            result.invoice.total = amount
            resolve(result)
          }
        }, err => {
          count++
          if(count >= productCount && result.orders.length > 0) {
            result.invoice.total = amount
            resolve(result)
          } else {
            reject('مشکلی پیش آمده است دوباره تلاش کنید.')
          }
        })
      }
    })
  },

  create: (attr) => {
    return new Promise((resolve, reject) =>
    {
      ProductService.infoOne(attr.id).then(product => {
        Order.create({
          storeId: product.store.id,
          customerId: attr.customer_id,
          invoiceId: attr.invoice_id,
          productId: attr.id,
          count: attr.count || 1,
          price: product.price - product.discount,
          weight: product.weight,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }).exec((err, order) => {
          if (err || !order) {
            return reject(err)
          }

          const outProduct = {
            id: product.id,
            price: product.price,
            discount: product.discount,
            weight: product.weight,
            title: product.title,
            image: (product.images) ? product.images[0] : null,
            category: product.category,
            store: product.store,
          }

          resolve({order, product: outProduct})
        })
      }, err => {
        return reject(err)
      })
    })
  },
}

