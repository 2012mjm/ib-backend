module.exports.params = {
  apiUrl: process.env.API_URL || 'http://localhost:1312',
  staticUrl: process.env.STATIC_URL || 'http://localhost:1312/data',

  commissionSystemSales: 5, // 5%

  smsUrl: 'http://rest.payamak-panel.com/api/',
  smsNumber: 50005000144157,
  smsUsername: 'fanavagroup',
  smsPassword: 'fanavagroup',

  zarinpalMerchantId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  zarinpalSandbox: true,

  adminName: 'جناب اوشلی',
  adminEmail: 'info@ibapp.ir',
  adminMobile: '021',
  adminPhone: '+98 21 8888 6286',
  adminAddress: 'خیابان شهید بهشتی، خیابان شهید سرافراز، انتهای کوچه یازدهم پلاک 6',
  adminProvince: {id: 8, name: 'تهران'},
  adminCity: {id: 329, name: 'تهران'},
  adminPostalCode: '',
  adminLatitude: '35.728560',
  adminLongitude: '51.421658',

  shippingType: {
    'payment-at-place': 'پس کرایه',
    'online': 'آنلاین',
    'free': 'رایگان'
  }
};
