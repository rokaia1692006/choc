
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
    'index.csr.html': {size: 63494, hash: '74e7c7ccb9d879e1ed4250b756b472cd9a7267ac7607cce125213ee35fece7db', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 5706, hash: '4c177d1f27657661e1cb52096a31329ae373cdf562bc15df599351d78f9b3dfc', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'shop/index.html': {size: 106240, hash: '0440322ec26505bbc4b7a91a9ebb721f3d70343bba7d1300ab712d2249bbcc6e', text: () => import('./assets-chunks/shop_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 92334, hash: 'fa25d6f08a15ed7d0d55a720be3ad1bcacd750b6ba8df3f44a2d07a0469d31c3', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'index.html': {size: 104832, hash: '6c506bfd8726c1a93ca94ae4fffc5b2d9b7a83fef639dc092c3265738f0ed2b1', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'orders/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/orders_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 89994, hash: '38c07c0ebabc3f5af58ed1955905dc198963b916b620eeb9a58b74253b1778a6', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 93139, hash: '80a66f87bc91a8a0dcbc0db18656017a8065f23f0b29e31e7fa9a672e4f04c43', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'order-receipt/index.html': {size: 92421, hash: '5dbd9d4457773dca4f82cb8227a6d13b1addfcfe366b420a8d85a623e46e0aa0', text: () => import('./assets-chunks/order-receipt_index_html.mjs').then(m => m.default)},
    'forgetpass/index.html': {size: 91197, hash: 'db3954418af51c54a62194d0254265c588290f2247758379ae44390be8444d91', text: () => import('./assets-chunks/forgetpass_index_html.mjs').then(m => m.default)},
    'styles-WOJ2KRFT.css': {size: 114914, hash: '6wV/aS5gY24', text: () => import('./assets-chunks/styles-WOJ2KRFT_css.mjs').then(m => m.default)}
  },
};
