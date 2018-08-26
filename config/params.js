module.exports.params = {
  apiUrl: process.env.API_URL || 'http://localhost:1312',
  staticUrl: process.env.STATIC_URL || 'http://localhost:1312/data',

  smsUrl: 'http://rest.payamak-panel.com/api/',
  smsNumber: 50005000144157,
  smsUsername: 'fanavagroup',
  smsPassword: 'fanavagroup',

  zarinpalMerchantId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  zarinpalSandbox: true,

  adminEmail: 'info@ibapp.ir',
  adminMobile: '021',

  shippingType: {
    'payment-at-place': 'پس کرایه',
    'online': 'آنلاین',
    'free': 'رایگان'
  }
};
