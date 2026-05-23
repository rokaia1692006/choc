
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
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 56917, hash: '5500c6ced35a2910e96fa9cb6a4226a9af609f327c5b71efc81c9321ba34abed', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1594, hash: '7977dd1e3137b14a8150edc621070719132cef584526e3b4bb0de464b680a8d5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'shop/index.html': {size: 93532, hash: 'afc5516c0e696db592904dd5dadd49b93df0f9132f58bae68d5081479fb41df6', text: () => import('./assets-chunks/shop_index_html.mjs').then(m => m.default)},
    'index.html': {size: 92103, hash: 'fbaba323ed6e19ac4714bec4abe2d835c34e2e40ffb2472311efd60223574a65', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 80751, hash: '52dadc1c2e1ebf4fc1b8dcc6cbfec976c38c54551fb57b03262c75de0c1830dc', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 78999, hash: '9c2d56a02a2e5b3f474754a4badbda74d561affed7e41958b3f8a443974e0449', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 81165, hash: '08c327e94a6ddf13797df9229dc1a099d6f5f79350b314f8948e6b858cf502fe', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'forgetpass/index.html': {size: 80256, hash: 'c2b1ee39145a53a71a98765f71b9053173d181d41f2a57d96253686701cbb685', text: () => import('./assets-chunks/forgetpass_index_html.mjs').then(m => m.default)},
    'styles-T56SRZGH.css': {size: 109536, hash: 'Dre51GvgvOI', text: () => import('./assets-chunks/styles-T56SRZGH_css.mjs').then(m => m.default)}
  },
};
