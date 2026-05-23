
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
    'index.csr.html': {size: 58950, hash: '62c506777e0fa2b29e3af6736bb817ca21261e88986659fcac30c4906269b0d1', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1594, hash: '00ebb2317cbe1155b89dd288e9c3ce41f8728eab557078efc59ef284a0d9fa4b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'shop/index.html': {size: 95663, hash: '8fb5f5f2e6d8e7ddd37d118395037194358ff8f7bfe93d8687bd8b6a19aa53c1', text: () => import('./assets-chunks/shop_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 83296, hash: '3ff33e8a507c7e2c703dfc7ed0d387ec1fcdeedcfd0a7ce9025afa4a6a9c9f0a', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'index.html': {size: 94234, hash: '3f7a9f735618f32eb4f03153e39ac092f93582201073d36d9480c6b55a2776b6', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 81130, hash: '05620e0bd7b3ee8d269befed45b5be6b161aa2fe53270fbf742ae807c3fa24c1', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 82882, hash: '1bdd68387d8ad841dc134a305e693a57425dbacc4db277e934c5ecff079517a6', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'forgetpass/index.html': {size: 82387, hash: 'f6a1875bae549eadaf2d66f80bd55533e32323e69940ef3d5f3dfc1ee2e2a12b', text: () => import('./assets-chunks/forgetpass_index_html.mjs').then(m => m.default)},
    'styles-BYDOT6HN.css': {size: 113644, hash: 'isbAU1hlSWM', text: () => import('./assets-chunks/styles-BYDOT6HN_css.mjs').then(m => m.default)}
  },
};
