
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/choc/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/choc"
  },
  {
    "renderMode": 2,
    "route": "/choc/shop"
  },
  {
    "renderMode": 2,
    "route": "/choc/cart"
  },
  {
    "renderMode": 2,
    "route": "/choc/checkout"
  },
  {
    "renderMode": 2,
    "route": "/choc/login"
  },
  {
    "renderMode": 2,
    "route": "/choc/register"
  },
  {
    "renderMode": 2,
    "route": "/choc/profile"
  },
  {
    "renderMode": 2,
    "route": "/choc/forgetpass"
  },
  {
    "renderMode": 2,
    "route": "/choc/orders"
  },
  {
    "renderMode": 2,
    "route": "/choc/order-receipt"
  },
  {
    "renderMode": 2,
    "redirectTo": "/choc/HomeComponent",
    "route": "/choc/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 61405, hash: '866b85031c0ecd2c130dbb01ca6b5d495065f23af6c3a26c07b67ab853982e46', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 3616, hash: '34125f09ba6788431a97c0c99e07c2b8875e76af774f8d5a31cd6d667f603885', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'index.html': {size: 102703, hash: '5cb9295bc4330c158e894ea695d7d5e5d5f827bdc2523fd5d62e1738b436594c', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 90071, hash: 'adbf27ee847e9d643a6f4d8b4fdd91c125221e26e3a1279d49fd5f488192cbe5', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 91000, hash: '813dda035ea762502ec671273311cda7f50a433c2b3dc7c9e7fa6b7aebd29df4', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'shop/index.html': {size: 104111, hash: '294d036760409905c43ed35433b0c291f91d968f56a63e53c8bf3c54cdfdeb0c', text: () => import('./assets-chunks/shop_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 87905, hash: '1820cfa677cea9a5357eb00fadcc106210b8fa96b23d65f8788f04bfabd5095f', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'orders/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/orders_index_html.mjs').then(m => m.default)},
    'forgetpass/index.html': {size: 89162, hash: '00b8a3bc387904b674565416193260448e3458b1a510fdf9295893a6ff978681', text: () => import('./assets-chunks/forgetpass_index_html.mjs').then(m => m.default)},
    'order-receipt/index.html': {size: 90332, hash: 'a4da6d88fcbaa8a486be998374895eabc6cf5ef560c09cec03bd9a019ab162d4', text: () => import('./assets-chunks/order-receipt_index_html.mjs').then(m => m.default)},
    'styles-WOJ2KRFT.css': {size: 114914, hash: '6wV/aS5gY24', text: () => import('./assets-chunks/styles-WOJ2KRFT_css.mjs').then(m => m.default)}
  },
};
