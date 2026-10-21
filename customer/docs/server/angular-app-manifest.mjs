
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
    'index.csr.html': {size: 63494, hash: 'e64fa3605a04341505b0f15c47fd5470c19c9af8250cb4d0a0641b327be9cdbc', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 5706, hash: '6622924dac44f0ac548d2763655b1122693a0afb879461f3ddc946159c1ace6c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 93714, hash: '012ec6ed59126ddfda67c43ef7d87b6a9ee7456b20b8d8b7dce2919f6909dc9a', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 92909, hash: '64ca2087c69520fbcc6031034d5c4f2801a0829b07fd087329766c96ab7663e8', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'shop/index.html': {size: 106815, hash: '4e0e4f702b47e9c7e74f96527a6d09685713c5c340ea525d203d36595341cece', text: () => import('./assets-chunks/shop_index_html.mjs').then(m => m.default)},
    'index.html': {size: 105407, hash: '3f3407b3400c7ec726f3a22bda1f07a7ea503bbd152bb9097ae732009e1a06fb', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'orders/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/orders_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 90569, hash: '29e3e35f6752c8de6e1c6013babda4fc7717001fffd0f8df7b81dffca3da61ce', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'order-receipt/index.html': {size: 92996, hash: 'af8f028456bd893608ffd476d3e2edd7353f6d462aaafc8c7f2100d0a36a7edb', text: () => import('./assets-chunks/order-receipt_index_html.mjs').then(m => m.default)},
    'forgetpass/index.html': {size: 91772, hash: '279c70c5705c6f4c172520a33a2e45f0381045f4e98c88c632aeb45f88f4c624', text: () => import('./assets-chunks/forgetpass_index_html.mjs').then(m => m.default)},
    'styles-WOJ2KRFT.css': {size: 114914, hash: '6wV/aS5gY24', text: () => import('./assets-chunks/styles-WOJ2KRFT_css.mjs').then(m => m.default)}
  },
};
