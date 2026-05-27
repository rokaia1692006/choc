
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
    'index.csr.html': {size: 59223, hash: 'a7a20ecde3acdd5df1ba002651fd5d0f83c0ed30f56c00f233bebcce8d8aabf8', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1594, hash: '342f08db2114bde6aa898759d00ee2397efe33f8d4cc92543f69590c64790b7b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'index.html': {size: 96655, hash: 'eab8d36e81fc15e1e1bd9805f2d0df6d520d1f592be209da6a715d09c7f37ce3', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 85550, hash: '0f2b7ec0ac6e7b2bf54c66b5cdab7e4fbc0e23b06f6b1a0c1e230e2b5dd6b5da', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'shop/index.html': {size: 98965, hash: '90b60fb3101a17b8b427555433f6986eb0137365ba914970c3aeeb3d36600548', text: () => import('./assets-chunks/shop_index_html.mjs').then(m => m.default)},
    'orders/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/orders_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 85183, hash: 'c885f11044eabf9d0c9dc39005f7047a668ce97a3bd769ed25b2707c4a7a7403', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 83384, hash: '581e87165e4cf04c420865c7fbabf9638aa29ad76c363534cdf4d01754c4e2cf', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'order-receipt/index.html': {size: 85810, hash: 'ebcf05133975b9d3beaa68a557dc832d93d7fc8bd2ba350b4a490de2522b602b', text: () => import('./assets-chunks/order-receipt_index_html.mjs').then(m => m.default)},
    'forgetpass/index.html': {size: 84641, hash: '42f7bffb8124e85cbb7dd2c30e0dd7b2d755b798c767cbbd54fef66617d74d8f', text: () => import('./assets-chunks/forgetpass_index_html.mjs').then(m => m.default)},
    'styles-6OW33QAK.css': {size: 114092, hash: 'whEETld7kR0', text: () => import('./assets-chunks/styles-6OW33QAK_css.mjs').then(m => m.default)}
  },
};
