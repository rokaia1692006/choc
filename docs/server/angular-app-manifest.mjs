
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
    "redirectTo": "/choc/HomeComponent",
    "route": "/choc/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 58950, hash: '26ad2d658062b8650ae11b125845e4f2aad2c96191096cea2009be407e138791', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1594, hash: '3e8cb4277606f14cf0e3e0867daafbae1a667c33eeb881579dfea2291990fc5b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 94602, hash: 'e6a6b4c0a7dd7bae277fc17141ba5f9cfad53da97bc47bad70c9015cbb47679c', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'shop/index.html': {size: 96031, hash: 'c01f88c8d96a5ac9c243f73db4267cca8f954db447cb8a3cf2e73d8ddcb55f7d', text: () => import('./assets-chunks/shop_index_html.mjs').then(m => m.default)},
    'forgetpass/index.html': {size: 82755, hash: 'a8384bdace635aa90dc72dc06e7f064152d4d150508e1fcd4098f6147304ef25', text: () => import('./assets-chunks/forgetpass_index_html.mjs').then(m => m.default)},
    'orders/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/orders_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 81498, hash: 'bc6edb0889c7175501d18ddd22dfe7480b4b52bbb476f5ee06c3ff2509ea12b0', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 83250, hash: 'd731c36ac03b607219861cf4c2cf7d66921aa35f6eee01707af7965142cf6a60', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 83664, hash: '04428f45a542510afaaccae5f1fabc890f160d207f482ab5e40ac9868de327a8', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'styles-BYDOT6HN.css': {size: 113644, hash: 'isbAU1hlSWM', text: () => import('./assets-chunks/styles-BYDOT6HN_css.mjs').then(m => m.default)}
  },
};
