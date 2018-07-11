os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

const self = module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      let result = {invoice: {}, orders: []}

      InvoiceService.add(attr).then(({invoice}) => {
        let productCount = attr.products.length
        result.invoice = {
          id: invoice.id,
          number: invoice.number
        }

        let count = 0
        let amount = 0
        for(let i=0; i<productCount; i++)
        {
          let item = attr.products[i]
          item.customer_id = attr.customer_id
          item.invoice_id = invoice.id
          self.create(item).then(({order, product}) =>
          {
            amount += (product.price - (product.discount || 0))*item.count

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
                price: product.price
              }
            })

            if(count >= productCount) {
              InvoiceService.update(invoice.id, {amount}).then()
              resolve(Object.assign({messages: ['سفارشات شما ثبت شد.']}, result))
            }
          }, err => {
            count++
            if(count >= productCount && result.orders.length > 0) {
              InvoiceService.update(invoice.id, {amount}).then()
              resolve(Object.assign({messages: ['سفارشات شما ثبت شد.']}, result))
            } else {
              reject('مشکلی پیش آمده است دوباره تلاش کنید.')
            }
          })
        }
      }, err => {
        reject(err)
      })
    })
  },

  create: (attr) => {
    return new Promise((resolve, reject) =>
    {
      ProductService.findById(attr.id).then(product => {
        Order.create({
          storeId: product.storeId,
          customerId: attr.customer_id,
          invoiceId: attr.invoice_id,
          productId: attr.id,
          count: attr.count || 1,
          price: product.price,
          weight: product.weight,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }).exec((err, order) => {
          if (err || !order) {
            return reject('خطایی رخ داده است، دوباره تلاش کنید.')
          }
          resolve({order, product})
        })
      }, err => {
        return reject(err)
      })
    })
  },
}

