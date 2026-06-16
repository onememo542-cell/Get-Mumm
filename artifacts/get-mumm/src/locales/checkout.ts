// Checkout page translations.

export const checkout = {
  // Validation messages
  nameRequired:       ["Name is required",             "الاسم مطلوب"],
  phoneRequired:      ["Phone is required",            "الهاتف مطلوب"],
  selectArea:         ["Please select your area",      "اختر المنطقة"],
  streetRequired:     ["Street address is required",   "عنوان الشارع مطلوب"],
  buildingRequired:   ["Building / apartment is required", "المبنى / الشقة مطلوب"],
  addItemsBefore:     ["Add items before checkout.",   "أضف عناصر قبل الدفع."],

  // Page title & sections
  title:              ["Checkout",          "إتمام الطلب"],
  deliveryDetails:    ["Delivery Details",  "تفاصيل التوصيل"],
  namePlaceholder:    ["Ahmed Mohamed",     "أحمد محمد"],
  deliveryArea:       ["Delivery Area",     "منطقة التوصيل"],
  streetAddress:      ["Street Address",    "عنوان الشارع"],
  streetPlaceholder:  ["7 El Nasr St.",     "7 شارع النصر"],
  buildingApartment:  ["Building / Apartment", "المبنى / الشقة"],
  buildingPlaceholder:["Bld. 3, Apt. 12",  "مبنى 3، شقة 12"],
  notesOptional:      ["Notes (optional)",  "ملاحظات (اختياري)"],
  notesPlaceholder:   ["Ring the bell, leave at door…", "اضغط الجرس، اترك عند الباب…"],

  // Payment
  paymentMethod:      ["Payment Method",   "طريقة الدفع"],
  cashOnDelivery:     ["Cash on Delivery", "الدفع عند الاستلام"],
  cashDesc:           ["Pay with cash when your order arrives.", "ادفع نقداً عند وصول طلبك."],
  creditDebitCard:    ["Credit / Debit Card", "بطاقة ائتمانية / خصم"],
  cardBrands:         ["Visa, Mastercard, Meeza", "فيزا، ماستركارد، ميزة"],

  // Summary
  orderSummary:       ["Order Summary",    "ملخص الطلب"],
  items:              ["items",            "عنصر"],
  deliveryFee:        ["Delivery fee",     "رسوم التوصيل"],
  placingOrder:       ["Placing Order…",   "جاري تأكيد الطلب…"],
  placeOrder:         ["Place Order",      "تأكيد الطلب"],
  estimatedDelivery:  ["Estimated delivery: 45–60 minutes", "التوصيل المتوقع: 45–60 دقيقة"],
} as const;
