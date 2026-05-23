import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Lang = 'en' | 'ar';

export interface Translations {

  home: string;
  shop: string;
  login: string;
  register: string;
  myOrders: string;
  myAccount: string;
  signOut: string;

  addToCart: string;
  outOfStock: string;

  cart: string;
  emptyCart: string;
  checkout: string;
  remove: string;
  total: string;
  subtotal: string;
  delivery: string;
chooseFlavour: string;
  deliveryDetails: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  apartment: string;
  notes: string;
  deliveryDate: string;
  placeOrder: string;
  placingOrder: string;
  orderSummary: string;
  createAccount: string;

  myOrdersTitle: string;
  noOrders: string;
  startShopping: string;
  orderPlaced: string;
  cancelOrder: string;
  cancelling: string;
  cancelHint: string;
  preparingNotice: string;

  statusPending: string;
  statusPreparing: string;
  statusDelivered: string;
  statusCancelled: string;
 
  forgotPassword: string;
  resetPassword: string;
  sendCode: string;
  verifyCode: string;
  setNewPassword: string;
 
  personalDetails: string;
  edit: string;
  saveChanges: string;
  cancel: string;
  changesSaved: string;

  loading: string;
  error: string;
  next: string;
  back: string;
badgeBestseller: string;
badgeNew: string;
badgeCustomise: string;
badgeFlavours: string;
  ourCollection: string;
handcrafted: string;
searchPlaceholder: string;
sortDefault: string;
sortPriceLow: string;
sortPriceHigh: string;
sortNameAZ: string;
noProductsFound: string;
productsCount: string;
flavours: string;
buildYourBox: string;
dateHint: string;
password: string;
passwordHint: string;
confirmPassword: string;
haveAccount: string;
clearCart: string;
buildYourBoxRows: string;
  selectMorePieces: string;
  rowsRemaining: string;
  boxReady: string;
  perPiece: string;
  outOfStockText: string;
  addBoxToCart: string;
  addBarToCart: string;
  selectFlavourContinue: string;
  rowSelected: string;
  rowsSelected: string;
  descKunafaPistachio: string;
  descCaramel: string;
  descCoffee: string;
  descGanache: string;
  descAlmond: string;
  descWhite: string;
}

export const en: Translations = {
  home: 'Home', shop: 'Shop', login: 'Login', register: 'Register',
  myOrders: 'My Orders', myAccount: 'My Account', signOut: 'Sign Out',
  addToCart: 'Add to Cart', outOfStock: 'Out of Stock',
  cart: 'Cart', emptyCart: 'Your cart is empty', checkout: 'Checkout',
  remove: 'Remove', total: 'Total', subtotal: 'Subtotal', delivery: 'Delivery',
  deliveryDetails: 'Delivery Details', fullName: 'Full Name',
  phoneNumber: 'Phone Number', streetAddress: 'Street Address',
  city: 'City', apartment: 'Apartment / Floor', notes: 'Notes',
  deliveryDate: 'Delivery Date', placeOrder: 'Place Order',
  placingOrder: 'Placing Order...', orderSummary: 'Order Summary',
  createAccount: 'Create an account to track your orders',
  myOrdersTitle: 'My Orders', noOrders: 'You have no orders yet.',
  startShopping: 'Start Shopping', orderPlaced: 'Placed',
  cancelOrder: 'Cancel Order', cancelling: 'Cancelling...',
  cancelHint: "You can cancel while your order hasn't started being prepared.",
  preparingNotice: 'Your order is being prepared and will be delivered on',
  statusPending: 'Pending', statusPreparing: 'Being Prepared',
  statusDelivered: 'Delivered', statusCancelled: 'Cancelled',
  forgotPassword: 'Forgot Password', resetPassword: 'Password Reset',
  sendCode: 'Send Code', verifyCode: 'Verify Code',
  setNewPassword: 'Set New Password',
  personalDetails: 'Personal Details', edit: 'Edit',
  saveChanges: 'Save Changes', cancel: 'Cancel',
  changesSaved: 'Changes saved successfully.',
  loading: 'Loading...', error: 'An error occurred.',
  next: 'Next', back: 'Back',
  chooseFlavour: 'Choose Flavour',ourCollection: 'Our Collection',
handcrafted: 'Handcrafted with the finest ingredients',
searchPlaceholder: 'Search chocolates',
sortDefault: 'Sort: Default',
sortPriceLow: 'Price: Low to High',
sortPriceHigh: 'Price: High to Low',
sortNameAZ: 'Name: A-Z',
noProductsFound: 'No products found',
productsCount: 'products',badgeBestseller: 'Bestseller',
badgeNew: 'New',
badgeCustomise: 'Customise',
badgeFlavours: 'Flavours',
buildYourBox: 'Build your box',
flavours: 'Flavours',
dateHint: 'Minimum 2 days from today. Unavailable dates cannot be selected.',
password: 'Password',
passwordHint: 'Min 6 characters',
confirmPassword: 'Confirm Password',
haveAccount: 'Already have an account?',
clearCart: 'Clear Cart',
buildYourBoxRows: 'Build your box (Rows of 4)',
  selectMorePieces: 'Select {{ remaining }} more pieces',
  rowsRemaining: 'rows remaining',
  boxReady: '✓ Box perfectly filled and ready to pack!',
  perPiece: 'per piece',
  outOfStockText: 'Out of stock',
  addBoxToCart: 'Add Box to Cart — EGP',
  addBarToCart: 'Add {{ name }} Bar to Cart — EGP',
  selectFlavourContinue: 'Select a flavour to continue',
  rowSelected: 'Row Selected',
  rowsSelected: 'Rows Selected',

  descKunafaPistachio: 'Rich 70% cacao casing with crispy traditional kunafa and premium pistachio paste.',
  descCaramel: 'Buttery slow-cooked artisan caramel with a delicate flake of sea salt.',
  descCoffee: 'Bold espresso bean infusion mixed into a dark velvety single-origin chocolate base.',
  descGanache: 'Silky smooth, melt-in-your-mouth whipped French cream and cacao filling.',
  descAlmond: 'Roasted California almond slivers buried inside a sweet hint of vanilla chocolate.',
  descWhite: 'Pure, creamy cocoa butter blend offering a wonderfully sweet and velvety experience.',
};

const ar: Translations = {
  home: 'الرئيسية', shop: 'المتجر', login: 'تسجيل الدخول', register: 'إنشاء حساب',
  myOrders: 'طلباتي', myAccount: 'حسابي', signOut: 'تسجيل الخروج',
  addToCart: 'أضف إلى السلة', outOfStock: 'غير متوفر',
  cart: 'السلة', emptyCart: 'سلتك فارغة', checkout: 'إتمام الطلب',
  remove: 'حذف', total: 'الإجمالي', subtotal: 'المجموع الجزئي', delivery: 'التوصيل',
  deliveryDetails: 'تفاصيل التوصيل', fullName: 'الاسم الكامل',
  phoneNumber: 'رقم الهاتف', streetAddress: 'عنوان الشارع',
  city: 'المدينة', apartment: 'الشقة / الطابق', notes: 'ملاحظات',
  deliveryDate: 'تاريخ التوصيل', placeOrder: 'تأكيد الطلب',
  placingOrder: 'جاري تأكيد الطلب...', orderSummary: 'ملخص الطلب',
  createAccount: 'إنشاء حساب لمتابعة طلباتك',
  myOrdersTitle: 'طلباتي', noOrders: 'ليس لديك طلبات بعد.',
  startShopping: 'ابدأ التسوق', orderPlaced: 'تم الطلب في',
  cancelOrder: 'إلغاء الطلب', cancelling: 'جاري الإلغاء...',
  cancelHint: 'يمكنك الإلغاء ما لم تبدأ عملية التحضير.',
  preparingNotice: 'طلبك قيد التحضير وسيتم توصيله في',
  statusPending: 'قيد الانتظار', statusPreparing: 'قيد التحضير',
  statusDelivered: 'تم التوصيل', statusCancelled: 'ملغي',
  forgotPassword: 'نسيت كلمة المرور', resetPassword: 'إعادة تعيين كلمة المرور',
  sendCode: 'إرسال الرمز', verifyCode: 'تحقق من الرمز',
  setNewPassword: 'تعيين كلمة مرور جديدة',
  personalDetails: 'البيانات الشخصية', edit: 'تعديل',
  saveChanges: 'حفظ التغييرات', cancel: 'إلغاء',
  changesSaved: 'تم حفظ التغييرات بنجاح.',
  loading: 'جاري التحميل...', error: 'حدث خطأ.',
  next: 'التالي', back: 'رجوع',
  chooseFlavour: 'اختر النكهة',
  ourCollection: 'مجموعتنا',
handcrafted: 'مصنوعة يدوياً بأجود المكونات',
searchPlaceholder: 'ابحث عن الشوكولاتة',
sortDefault: 'ترتيب: افتراضي',
sortPriceLow: 'السعر: من الأقل للأعلى',
sortPriceHigh: 'السعر: من الأعلى للأقل',
sortNameAZ: 'الاسم: أ-ي',
noProductsFound: 'لا توجد منتجات',
productsCount: 'منتجات',badgeBestseller: 'الأكثر مبيعاً',
badgeNew: 'جديد',
badgeCustomise: 'خصّص',
badgeFlavours: 'نكهات',
buildYourBox: 'كوّن علبتك',
flavours: 'نكهات',
dateHint: 'الحد الأدنى يومان من اليوم. التواريخ غير المتاحة لا يمكن اختيارها.',
password: 'كلمة المرور',
passwordHint: 'الحد الأدنى ٦ أحرف',
confirmPassword: 'تأكيد كلمة المرور',
haveAccount: 'لديك حساب بالفعل؟',
clearCart: 'إفراغ السلة',
buildYourBoxRows: 'اختر مكونات علبتك (مجموعات من ٤ قطع)',
  selectMorePieces: 'اختر {{ remaining }} قطع إضافية',
  rowsRemaining: 'صفوف متبقية',
  boxReady: '✓ تم ملء العلبة بالكامل وجاهزة للتعبئة!',
  perPiece: 'للقطعة',
  outOfStockText: 'نفذت الكمية',
  addBoxToCart: 'أضف العلبة للسلة — جنيه',
  addBarToCart: 'أضف قالب {{ name }} للسلة — جنيه',
  selectFlavourContinue: 'اختر نكهة للمتابعة',
  rowSelected: 'صف واحد مختار',
  rowsSelected: 'صفوف مختارة',

  descKunafaPistachio: 'غلاف غني من الكاكاو بنسبة ٧٠٪ مع كنافة تقليدية مقرمشة ومعجون الفستق الفاخر.',
  descCaramel: 'كراميل حرفي مطبوخ ببطء مع لمسة دقيقة من رقائق ملح البحر.',
  descCoffee: 'مزيج إسبريسو قوي ممزوج بقاعدة شوكولاتة داكنة مخملية فاخرة.',
  descGanache: 'حشوة كاكاو وكريمة فرنسية مخفوقة ناعمة وحريرية تذوب في الفم.',
  descAlmond: 'رقائق اللوز الكاليفورني المحمص داخل لمسة حلوة من شوكولاتة الفانيليا.',
  descWhite: 'مزيج نقي من زبدة الكاكاو الكريمية يقدم تجربة حلوة ومخملية رائعة.',
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private _lang = signal<Lang>(this.loadLang());
  current = computed(() => this._lang());
  t = computed(() => this._lang() === 'ar' ? ar : en);
  isArabic = computed(() => this._lang() === 'ar');

  private loadLang(): Lang {
    if (!this.isBrowser) return 'en';
    return (localStorage.getItem('choooc_lang') as Lang) || 'en';
  }

  setLang(lang: Lang) {
    this._lang.set(lang);
    if (this.isBrowser) {
      localStorage.setItem('choooc_lang', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  }

 
  init() {
    if (this.isBrowser) {
      const lang = this._lang();
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  }
}