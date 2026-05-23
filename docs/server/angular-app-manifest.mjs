
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
    "redirectTo": "/choc/HomeComponent",
    "route": "/choc/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 58950, hash: 'a40323bbf0336c031abbeeca9654e1be7bb34d1a5f0cae721cc2bc56a6f0c844', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1594, hash: 'fdfc21170c3c8f370534b4e6c510311ad073a68dddf966ceda14b8d86662013a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'shop/index.html': {size: 96017, hash: '25ee244be63678e313034e410affbaaf0941029070fab52cc780204e6cd80b07', text: () => import('./assets-chunks/shop_index_html.mjs').then(m => m.default)},
    'index.html': {size: 94588, hash: 'fb04dec8f9864598f63e22e446a645110c59c5d5a1eadc7fc51f4bc9f971dc37', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 81484, hash: 'a142a93bdbf8ebcc1e0f8c4dd1330885ea653aa384ac1dd41ffde77448dad8c3', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 83650, hash: '1139ced8b363ba7436e88e513145b8a0b21614ca5037d79c49923b1095552d42', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 83236, hash: '672de1af62cf295d6ffcf9d61df648e772edc6f058c711406c022b72bb93186c', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'forgetpass/index.html': {size: 82741, hash: '15d747724cdfc6d0dc9f5ce4b5aecdf8e9964fdf43c3284d799028eacd60684a', text: () => import('./assets-chunks/forgetpass_index_html.mjs').then(m => m.default)},
    'styles-BYDOT6HN.css': {size: 113644, hash: 'isbAU1hlSWM', text: () => import('./assets-chunks/styles-BYDOT6HN_css.mjs').then(m => m.default)}
  },
};
