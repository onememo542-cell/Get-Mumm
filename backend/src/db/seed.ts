import { db, getPoolForMigrations } from "./index.js";
import {
  categoriesTable,
  chefsTable,
  menuItemsTable,
  testimonialsTable,
} from "./schema/index.js";
import type { Category } from "./schema/categories.js";
import type { Chef } from "./schema/chefs.js";
import type { MenuItem } from "./schema/menu_items.js";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Seeding Get Mumm database…");

  await db.delete(menuItemsTable);
  await db.delete(testimonialsTable);
  await db.delete(chefsTable);
  await db.delete(categoriesTable);
  console.log("  ✓ Cleared existing data");

  /* ── Categories ─────────────────────────────────────────────────────
     Each category gets the most visually accurate image from /public   */
  const cats = await db.insert(categoriesTable).values([
    {
      name: "Rice & Grain Dishes",
      nameAr: "أطباق الأرز والحبوب",
      slug: "rice-grains",
      description: "Egypt's beloved rice and grain staples — from street-side koshari to hearty ful medames and flaky fiteer.",
      descriptionAr: "أشهر أطباق الأرز والحبوب المصرية — من كشري الشارع إلى الفول المدمس والفطير المشلتت.",
      imageUrl: "/koshari.png",
      itemCount: 0,
    },
    {
      name: "Stuffed Dishes",
      nameAr: "محاشي",
      slug: "stuffed",
      description: "Tender vegetables and vine leaves lovingly stuffed with herbed rice, slow-cooked to perfection.",
      descriptionAr: "خضروات وأوراق عنب محشوة بأرز معطر، مطبوخة على نار هادئة بعناية.",
      imageUrl: "/mahshi.png",
      itemCount: 0,
    },
    {
      name: "Meat Dishes",
      nameAr: "أطباق اللحوم",
      slug: "meat",
      description: "Rich braised meats, festive fattah, and hand-rolled kofta grilled over charcoal.",
      descriptionAr: "لحوم مشوية فاخرة وفتة الأعياد وكفتة محضّرة باليد على الفحم.",
      imageUrl: "/kofta.png",
      itemCount: 0,
    },
    {
      name: "Soups & Stews",
      nameAr: "شوربات وطواجن",
      slug: "soups-stews",
      description: "Soul-warming molokhia, hearty lentil soup, and slow-simmered tagines.",
      descriptionAr: "ملوخية دافئة للروح وشوربة عدس غنية وطواجن تُطهى على نار هادئة.",
      imageUrl: "/molokhia.png",
      itemCount: 0,
    },
    {
      name: "Salads & Sides",
      nameAr: "سلطات ومقبلات",
      slug: "salads-sides",
      description: "Fresh garden salads, creamy tahini, smoky baba ghanoush, and seasonal mezze.",
      descriptionAr: "سلطات طازجة وطحينة كريمية وبابا غنوج مدخن ومزة موسمية.",
      imageUrl: "/mahshi.png",
      itemCount: 0,
    },
    {
      name: "Desserts",
      nameAr: "حلويات",
      slug: "desserts",
      description: "Egypt's most beloved sweets — from warm umm ali to golden basbousa drizzled with honey.",
      descriptionAr: "أشهر الحلويات المصرية — من أم علي الدافئة إلى البسبوسة الذهبية بالعسل.",
      imageUrl: "/umm_ali.png",
      itemCount: 0,
    },
  ]).returning();

  console.log(`  ✓ Inserted ${cats.length} categories`);
  const c = Object.fromEntries(cats.map((x: Category) => [x.slug, x]));

  /* ── Chefs ───────────────────────────────────────────────────────────
     Use real chef portrait images (chef1.png / chef2.png), not dish photos.
     Alternate between the two available portraits across 5 chefs.        */
  const chefs = await db.insert(chefsTable).values([
    {
      name: "Umm Hassan",
      nameAr: "أم حسن",
      bio: "A Cairo kitchen legend with 30 years perfecting street classics. Her koshari is the standard every vendor is measured against — three lentil layers, hand-fried onions, and a sauce made fresh every morning.",
      bioAr: "أسطورة مطبخ القاهرة بخبرة 30 عاماً في إتقان أكلات الشارع. كشريها هو المقياس الذي يُقاس به كل الباعة — ثلاث طبقات من العدس وبصل مقلي باليد وصلصة طازجة كل صباح.",
      imageUrl: "/chef1.png",
      specialties: ["Koshari", "Ful Medames", "Fiteer"],
      specialtiesAr: ["كشري", "فول مدمس", "فطير"],
      itemCount: 0, rating: 4.9, joinedYear: 2016,
    },
    {
      name: "Nadia Magdi",
      nameAr: "نادية مجدي",
      bio: "Nadia inherited her grandmother's mahshi recipes from Alexandria and has spent two decades perfecting every stuffed leaf and vegetable. She rolls each vine leaf by hand — no machine, no shortcuts.",
      bioAr: "نادية ورثت وصفات جدتها في المحاشي من الإسكندرية وأمضت عقدين في إتقان كل ورقة وخضرة محشوة. تلف كل ورقة عنب باليد — بدون آلة ولا اختصارات.",
      imageUrl: "/chef2.png",
      specialties: ["Mahshi", "Wara Einab", "Stuffed Peppers"],
      specialtiesAr: ["محشي", "ورق عنب", "فلفل محشي"],
      itemCount: 0, rating: 4.8, joinedYear: 2017,
    },
    {
      name: "Samia Farouk",
      nameAr: "سامية فاروق",
      bio: "Samia's Eid fattah became so famous her neighbours started ordering weeks in advance. Her kofta has a secret blend of seven spices, and her hawawshi is baked in a traditional clay oven for the authentic crunch.",
      bioAr: "فتة سامية في العيد أصبحت شهيرة لدرجة أن جيرانها بدأوا يطلبون قبل أسابيع. كفتتها لها مزيج سري من سبع بهارات وهواوشيها مخبوز في فرن فخاري تقليدي للحصول على القرمشة الأصيلة.",
      imageUrl: "/chef1.png",
      specialties: ["Fattah", "Kofta", "Hawawshi"],
      specialtiesAr: ["فتة", "كفتة", "هواوشي"],
      itemCount: 0, rating: 4.9, joinedYear: 2015,
    },
    {
      name: "Hanan Ibrahim",
      nameAr: "حنان إبراهيم",
      bio: "Hanan's slow-cooked molokhia with rabbit is a Sunday institution in Giza. Her lentil soup is made with red lentils from Luxor and her chicken tagine simmers for three hours in a sealed clay pot.",
      bioAr: "ملوخية حنان المطبوخة ببطء مع الأرانب هي طقس يوم الأحد في الجيزة. شوربة عدسها من العدس الأحمر من الأقصر وطاجن دجاجها يُطهى لثلاث ساعات في طاجن فخاري مختوم.",
      imageUrl: "/chef2.png",
      specialties: ["Molokhia", "Lentil Soup", "Chicken Tagine"],
      specialtiesAr: ["ملوخية", "شوربة عدس", "طاجن دجاج"],
      itemCount: 0, rating: 4.7, joinedYear: 2018,
    },
    {
      name: "Maha El-Sayed",
      nameAr: "مها السيد",
      bio: "The undisputed queen of Egyptian desserts. Maha's umm ali is served warm with just the right balance of cream, pastry and toasted nuts. Her konafa is hand-pulled each morning and her basbousa is soaked in rose-water syrup for 24 hours.",
      bioAr: "الملكة غير المنازعة للحلويات المصرية. أم علي مها تُقدَّم دافئة بالتوازن الصحيح من الكريمة والعجينة والمكسرات. كنافتها تُسحب باليد كل صباح وبسبوسها تنقع في قطر ماء الورد لـ 24 ساعة.",
      imageUrl: "/chef1.png",
      specialties: ["Umm Ali", "Basbousa", "Konafa"],
      specialtiesAr: ["أم علي", "بسبوسة", "كنافة"],
      itemCount: 0, rating: 4.9, joinedYear: 2019,
    },
  ]).returning();

  console.log(`  ✓ Inserted ${chefs.length} chefs`);
  const chef = Object.fromEntries(chefs.map((x: Chef) => [x.name, x]));

  /* ── Menu Items ──────────────────────────────────────────────────────
     Every item gets the image that most accurately represents that dish.
     Where an exact match exists in /public it is used; otherwise the
     closest visual match from the available set is chosen.               */
  const items = await db.insert(menuItemsTable).values([

    /* ── Rice & Grain Dishes ─────────────────────────────────────── */
    {
      name: "Koshari",
      nameAr: "كُشري",
      description: "Egypt's iconic street dish — layers of rice, brown lentils, macaroni, crispy fried onions, tangy tomato sauce and a garlic-vinegar daqqa, all in one bowl.",
      descriptionAr: "أشهر أكلة شعبية مصرية — طبقات من الأرز والعدس البني والمعكرونة والبصل المقلي المقرمش مع صلصة طماطم حامضة ودقة ثوم وخل في طبق واحد.",
      price: 65,
      categoryId: c["rice-grains"].id,
      categoryName: "Rice & Grain Dishes", categoryNameAr: "أطباق الأرز والحبوب",
      imageUrl: "/koshari.png",
      dietary: ["vegan"],
      isAvailable: true, isFeatured: true,
      chefName: chef["Umm Hassan"].name, chefNameAr: chef["Umm Hassan"].nameAr,
      rating: 4.9, prepTimeMinutes: 30,
    },
    {
      name: "Ful Medames",
      nameAr: "فول مدمس",
      description: "Slow-simmered fava beans with garlic, cumin, lemon and a generous drizzle of extra-virgin olive oil. Egypt's breakfast staple, made the old way — overnight in a copper pot.",
      descriptionAr: "فول مدمس مطبوخ ببطء مع الثوم والكمون والليمون ورذاذ سخي من زيت الزيتون. وجبة الإفطار المصرية الأصيلة بالطريقة القديمة — طوال الليل في وعاء نحاسي.",
      price: 45,
      categoryId: c["rice-grains"].id,
      categoryName: "Rice & Grain Dishes", categoryNameAr: "أطباق الأرز والحبوب",
      imageUrl: "/koshari.png",
      dietary: ["vegan", "gluten-free"],
      isAvailable: true, isFeatured: false,
      chefName: chef["Umm Hassan"].name, chefNameAr: chef["Umm Hassan"].nameAr,
      rating: 4.8, prepTimeMinutes: 45,
    },
    {
      name: "Fiteer Meshaltet",
      nameAr: "فطير مشلتت",
      description: "Layers upon layers of paper-thin dough folded with pure butter and baked until flaky and golden — Egypt's ancient flatbread, served with honey and thick cream.",
      descriptionAr: "طبقات فوق طبقات من العجينة الرقيقة مطوية بالسمن الخالص ومخبوزة حتى تصبح ذهبية ومقرمشة — الفطير المصري القديم، يُقدَّم مع العسل والقشطة.",
      price: 80,
      categoryId: c["rice-grains"].id,
      categoryName: "Rice & Grain Dishes", categoryNameAr: "أطباق الأرز والحبوب",
      imageUrl: "/koshari.png",
      dietary: [],
      isAvailable: true, isFeatured: false,
      chefName: chef["Umm Hassan"].name, chefNameAr: chef["Umm Hassan"].nameAr,
      rating: 4.8, prepTimeMinutes: 50,
    },
    {
      name: "Macarona Béchamel",
      nameAr: "مكرونة بشاميل",
      description: "Layered pasta baked with spiced minced beef and a thick, golden béchamel crust — Egypt's beloved answer to lasagne, baked in a deep tray and cut in generous squares.",
      descriptionAr: "مكرونة متعددة الطبقات مخبوزة مع لحم بقر مفروم متبل وبشاميل ذهبي سميك — الإجابة المصرية على اللازانيا، مخبوزة في صينية عميقة ومقطعة مربعات سخية.",
      price: 110,
      categoryId: c["rice-grains"].id,
      categoryName: "Rice & Grain Dishes", categoryNameAr: "أطباق الأرز والحبوب",
      imageUrl: "/fatta.png",
      dietary: [],
      isAvailable: true, isFeatured: false,
      chefName: chef["Umm Hassan"].name, chefNameAr: chef["Umm Hassan"].nameAr,
      rating: 4.7, prepTimeMinutes: 60,
    },

    /* ── Stuffed Dishes ──────────────────────────────────────────── */
    {
      name: "Stuffed Vine Leaves",
      nameAr: "ورق عنب",
      description: "Rolled vine leaves packed with herbed rice, diced tomato and a hint of lemon, slow-cooked in a pot lined with lamb ribs for a deep, rich flavour.",
      descriptionAr: "أوراق عنب مفرودة محشوة بأرز معطر وطماطم مفرومة ورائحة الليمون، مطبوخة ببطء في طنجرة مبطنة بضلوع خروف لنكهة غنية وعميقة.",
      price: 140,
      categoryId: c["stuffed"].id,
      categoryName: "Stuffed Dishes", categoryNameAr: "محاشي",
      imageUrl: "/mahshi.png",
      dietary: ["vegan"],
      isAvailable: true, isFeatured: true,
      chefName: chef["Nadia Magdi"].name, chefNameAr: chef["Nadia Magdi"].nameAr,
      rating: 4.9, prepTimeMinutes: 90,
    },
    {
      name: "Mixed Mahshi Platter",
      nameAr: "طبق محاشي مشكل",
      description: "Zucchini, Nile cabbage, peppers and aubergine all stuffed with Nadia's signature herbed rice — a celebration platter that feeds the whole table.",
      descriptionAr: "كوسة وكرنب نيلي وفلفل وباذنجان محشو بأرز نادية المميز — طبق احتفالي يكفي الطاولة كلها.",
      price: 165,
      categoryId: c["stuffed"].id,
      categoryName: "Stuffed Dishes", categoryNameAr: "محاشي",
      imageUrl: "/mahshi.png",
      dietary: ["vegan"],
      isAvailable: true, isFeatured: false,
      chefName: chef["Nadia Magdi"].name, chefNameAr: chef["Nadia Magdi"].nameAr,
      rating: 4.8, prepTimeMinutes: 100,
    },

    /* ── Meat Dishes ─────────────────────────────────────────────── */
    {
      name: "Lamb Fattah",
      nameAr: "فتة لحم ضأن",
      description: "Crispy baladi bread, fragrant white rice and slow-braised whole lamb bathed in a rich garlic-vinegar broth, finished with toasted almonds and pine nuts.",
      descriptionAr: "خبز بلدي مقرمش وأرز أبيض فاخر وخروف كامل مسلوق ببطء في مرق غني بالثوم والخل، منتهي باللوز وحبوب الصنوبر المحمصة.",
      price: 235,
      categoryId: c["meat"].id,
      categoryName: "Meat Dishes", categoryNameAr: "أطباق اللحوم",
      imageUrl: "/fatta.png",
      dietary: [],
      isAvailable: true, isFeatured: true,
      chefName: chef["Samia Farouk"].name, chefNameAr: chef["Samia Farouk"].nameAr,
      rating: 4.9, prepTimeMinutes: 120,
    },
    {
      name: "Grilled Kofta",
      nameAr: "كفتة مشوية",
      description: "Hand-rolled ground beef and lamb kofta seasoned with Samia's seven-spice blend — parsley, onion, cumin, coriander, cinnamon, allspice and a pinch of chilli — charcoal-grilled and served with tahini.",
      descriptionAr: "كفتة لحم بقر وضأن مفرود باليد، متبلة بمزيج سامية السري من سبع بهارات — بقدونس وبصل وكمون وكسبرة وقرفة وبهار وقليل من الفلفل الحار — مشوية على الفحم وتُقدَّم مع الطحينة.",
      price: 155,
      categoryId: c["meat"].id,
      categoryName: "Meat Dishes", categoryNameAr: "أطباق اللحوم",
      imageUrl: "/kofta.png",
      dietary: ["gluten-free"],
      isAvailable: true, isFeatured: true,
      chefName: chef["Samia Farouk"].name, chefNameAr: chef["Samia Farouk"].nameAr,
      rating: 4.8, prepTimeMinutes: 40,
    },
    {
      name: "Hawawshi",
      nameAr: "هواوشي",
      description: "Minced beef and lamb heavily spiced with onion, chilli and fresh herbs, sealed inside baladi dough and baked in a clay oven until the outside is shatteringly crisp.",
      descriptionAr: "لحم بقر وضأن مفروم متبل بكثافة بالبصل والفلفل والأعشاب الطازجة، مختوم داخل عجينة بلدي ومخبوز في فرن فخاري حتى تصبح الخارجية مقرمشة تماماً.",
      price: 95,
      categoryId: c["meat"].id,
      categoryName: "Meat Dishes", categoryNameAr: "أطباق اللحوم",
      imageUrl: "/kofta.png",
      dietary: [],
      isAvailable: true, isFeatured: false,
      chefName: chef["Samia Farouk"].name, chefNameAr: chef["Samia Farouk"].nameAr,
      rating: 4.7, prepTimeMinutes: 35,
    },

    /* ── Soups & Stews ───────────────────────────────────────────── */
    {
      name: "Molokhia with Chicken",
      nameAr: "ملوخية بالدجاج",
      description: "Silky jute leaves simmered low and slow in a rich free-range chicken broth, finished with a sizzling ta'leya of garlic and dried coriander poured tableside.",
      descriptionAr: "أوراق ملوخية ناعمة تُطهى ببطء في مرق دجاج بلدي غني، منتهية بتقلية مقلية من الثوم والكسبرة المجففة تُسكب على الطاولة.",
      price: 130,
      categoryId: c["soups-stews"].id,
      categoryName: "Soups & Stews", categoryNameAr: "شوربات وطواجن",
      imageUrl: "/molokhia.png",
      dietary: ["gluten-free"],
      isAvailable: true, isFeatured: false,
      chefName: chef["Hanan Ibrahim"].name, chefNameAr: chef["Hanan Ibrahim"].nameAr,
      rating: 4.8, prepTimeMinutes: 50,
    },
    {
      name: "Shorbet Ads",
      nameAr: "شوربة عدس",
      description: "Velvety red lentil soup made with Luxor lentils, roasted cumin, fresh lemon and topped with a swirl of crispy golden fried onions and a drizzle of chilli oil.",
      descriptionAr: "شوربة عدس أحمر مخملية من عدس الأقصر مع كمون محمص وليمون طازج ومزينة بحلقات بصل مقلية ذهبية ورذاذ زيت الفلفل الحار.",
      price: 75,
      categoryId: c["soups-stews"].id,
      categoryName: "Soups & Stews", categoryNameAr: "شوربات وطواجن",
      imageUrl: "/molokhia.png",
      dietary: ["vegan", "gluten-free"],
      isAvailable: true, isFeatured: false,
      chefName: chef["Hanan Ibrahim"].name, chefNameAr: chef["Hanan Ibrahim"].nameAr,
      rating: 4.7, prepTimeMinutes: 35,
    },
    {
      name: "Chicken Tagine",
      nameAr: "طاجن دجاج",
      description: "Free-range chicken, seasonal vegetables and preserved lemon sealed inside a clay tagine with saffron, then slow-cooked for three hours until the meat falls from the bone.",
      descriptionAr: "دجاج بلدي وخضار موسمية وليمون مخلل مختومة داخل طاجن فخاري مع زعفران، ثم تُطهى ببطء لثلاث ساعات حتى تتساقط اللحمة من العظمة.",
      price: 175,
      categoryId: c["soups-stews"].id,
      categoryName: "Soups & Stews", categoryNameAr: "شوربات وطواجن",
      imageUrl: "/molokhia.png",
      dietary: ["gluten-free"],
      isAvailable: true, isFeatured: false,
      chefName: chef["Hanan Ibrahim"].name, chefNameAr: chef["Hanan Ibrahim"].nameAr,
      rating: 4.8, prepTimeMinutes: 80,
    },

    /* ── Salads & Sides ──────────────────────────────────────────── */
    {
      name: "Salata Baladi",
      nameAr: "سلطة بلدي",
      description: "Classic Egyptian village salad of vine-ripened tomatoes, cucumber, red onion and flat-leaf parsley in a sharp lemon and extra-virgin olive oil dressing.",
      descriptionAr: "السلطة البلدية الكلاسيكية من طماطم ناضجة على الكرمة وخيار وبصل أحمر وبقدونس مع تتبيلة حامضة من الليمون وزيت الزيتون البكر.",
      price: 55,
      categoryId: c["salads-sides"].id,
      categoryName: "Salads & Sides", categoryNameAr: "سلطات ومقبلات",
      imageUrl: "/mahshi.png",
      dietary: ["vegan", "gluten-free"],
      isAvailable: true, isFeatured: false,
      chefName: chef["Umm Hassan"].name, chefNameAr: chef["Umm Hassan"].nameAr,
      rating: 4.6, prepTimeMinutes: 10,
    },
    {
      name: "Tahini & Baba Ghanoush",
      nameAr: "طحينة وبابا غنوج",
      description: "Freshly stone-ground sesame tahini alongside flame-roasted aubergine mashed with garlic, lemon and smoked paprika — served with warm baladi bread for dipping.",
      descriptionAr: "طحينة سمسم مطحونة حجراً طازجة مع متبل باذنجان محمص على النار ومهروس بالثوم والليمون والبابريكا المدخنة — تُقدَّم مع خبز بلدي دافئ.",
      price: 70,
      categoryId: c["salads-sides"].id,
      categoryName: "Salads & Sides", categoryNameAr: "سلطات ومقبلات",
      imageUrl: "/mahshi.png",
      dietary: ["vegan"],
      isAvailable: true, isFeatured: false,
      chefName: chef["Samia Farouk"].name, chefNameAr: chef["Samia Farouk"].nameAr,
      rating: 4.7, prepTimeMinutes: 15,
    },

    /* ── Desserts ────────────────────────────────────────────────── */
    {
      name: "Umm Ali",
      nameAr: "أم علي",
      description: "Egypt's most beloved dessert — torn puff pastry soaked in sweetened cream, scattered with toasted almonds, hazelnuts, coconut and raisins, then baked until bubbling and golden.",
      descriptionAr: "أشهر حلوى مصرية — عجينة منفوخة مقطعة منقوعة في كريمة محلاة مع لوز وبندق وجوز هند وزبيب محمص، ثم مخبوزة حتى تفور وتصبح ذهبية.",
      price: 85,
      categoryId: c["desserts"].id,
      categoryName: "Desserts", categoryNameAr: "حلويات",
      imageUrl: "/umm_ali.png",
      dietary: [],
      isAvailable: true, isFeatured: true,
      chefName: chef["Maha El-Sayed"].name, chefNameAr: chef["Maha El-Sayed"].nameAr,
      rating: 4.9, prepTimeMinutes: 25,
    },
    {
      name: "Basbousa bil Ashta",
      nameAr: "بسبوسة بالقشطة",
      description: "Golden semolina cake soaked in rose-water syrup for 24 hours, topped with thick clotted ashta cream and crushed pistachios — Maha's signature after-Ramadan dessert.",
      descriptionAr: "كيكة سميد ذهبية منقوعة في قطر ماء الورد لـ 24 ساعة، مزينة بالقشطة الكثيفة والفستق المطحون — حلوى مها المميزة بعد رمضان.",
      price: 75,
      categoryId: c["desserts"].id,
      categoryName: "Desserts", categoryNameAr: "حلويات",
      imageUrl: "/umm_ali.png",
      dietary: [],
      isAvailable: true, isFeatured: false,
      chefName: chef["Maha El-Sayed"].name, chefNameAr: chef["Maha El-Sayed"].nameAr,
      rating: 4.8, prepTimeMinutes: 20,
    },
    {
      name: "Konafa bil Goz el-Hend",
      nameAr: "كنافة بجوز الهند",
      description: "Hand-pulled shredded filo pastry filled with sweet cream cheese and toasted coconut, baked until deep golden, then flooded with orange-blossom honey syrup.",
      descriptionAr: "عجينة كنافة مسحوبة باليد محشوة بجبنة قشطة حلوة وجوز هند محمص، مخبوزة حتى تصبح ذهبية عميقة ثم تُغرق بقطر عسل زهر البرتقال.",
      price: 95,
      categoryId: c["desserts"].id,
      categoryName: "Desserts", categoryNameAr: "حلويات",
      imageUrl: "/umm_ali.png",
      dietary: [],
      isAvailable: true, isFeatured: false,
      chefName: chef["Maha El-Sayed"].name, chefNameAr: chef["Maha El-Sayed"].nameAr,
      rating: 4.9, prepTimeMinutes: 30,
    },

  ]).returning();

  console.log(`  ✓ Inserted ${items.length} menu items`);

  /* ── Update itemCount on chefs and categories ────────────────────── */
  for (const ch of chefs) {
    const count = items.filter((i: MenuItem) => i.chefName === ch.name).length;
    await db.update(chefsTable).set({ itemCount: count }).where(eq(chefsTable.id, ch.id));
  }
  for (const cat of cats) {
    const count = items.filter((i: MenuItem) => i.categoryId === cat.id).length;
    await db.update(categoriesTable).set({ itemCount: count }).where(eq(categoriesTable.id, cat.id));
  }
  console.log("  ✓ Updated itemCount on chefs and categories");

  /* ── Testimonials ────────────────────────────────────────────────────
     Customers: avatarUrl = dish they ordered (most relevant image).
     Offices  : avatarUrl = /office_catering.png.
     All quotes reference specific chef names and dish names from above.  */
  const testimonials = await db.insert(testimonialsTable).values([
    {
      name: "Layla Hassan",
      nameAr: "ليلى حسن",
      quote: "Umm Hassan's koshari brought back memories of eating on the street in Sayeda Zeinab. Three lentil layers, crispy onions, the sauce just right. I've ordered every week for four months now.",
      quoteAr: "كشري أم حسن أعاد لي ذكريات الأكل في شارع السيدة زينب. ثلاث طبقات عدس وبصل مقلي والصلصة صح تماماً. طلبت كل أسبوع منذ أربعة أشهر.",
      type: "customer",
      rating: 5,
      avatarUrl: "/koshari.png",
    },
    {
      name: "Ahmed Kamal",
      nameAr: "أحمد كمال",
      quote: "Nadia's mixed mahshi platter — my entire family argued over who got the last stuffed pepper. That is the highest compliment I know how to give.",
      quoteAr: "طبق محاشي نادية المشكل — تجادلت عائلتي بأكملها على آخر فلفلة محشية. هذا أعلى مديح أعرفه.",
      type: "customer",
      rating: 5,
      avatarUrl: "/mahshi.png",
    },
    {
      name: "Dina Samir",
      nameAr: "دينا سمير",
      quote: "Samia's lamb fattah for Eid was exactly what I grew up eating at my grandmother's — crispy bread soaked in that garlic broth. I cried a little, honestly.",
      quoteAr: "فتة لحم الضأن من سامية في العيد كانت بالضبط ما كبرت عليه في بيت جدتي — خبز مقرمش منقوع في مرق الثوم. بكيت قليلاً بصراحة.",
      type: "customer",
      rating: 5,
      avatarUrl: "/fatta.png",
    },
    {
      name: "Sara Mostafa",
      nameAr: "سارة مصطفى",
      quote: "Maha's umm ali arrived warm, perfectly creamy, with toasted nuts in every spoonful. I closed my eyes and I was back in my mother's kitchen. Five stars isn't enough.",
      quoteAr: "أم علي مها وصلت دافئة وكريمية بشكل مثالي مع مكسرات محمصة في كل ملعقة. أغمضت عيني وعدت إلى مطبخ أمي. خمس نجوم لا تكفي.",
      type: "customer",
      rating: 5,
      avatarUrl: "/umm_ali.png",
    },
    {
      name: "Khaled Mansour",
      nameAr: "خالد منصور",
      quote: "Hanan's molokhia with chicken is the real thing — that ta'leya poured at the table, the smell that fills the room. My kids have started requesting it every Sunday like clockwork.",
      quoteAr: "ملوخية حنان بالدجاج هي الشيء الحقيقي — التقلية تُسكب على الطاولة والرائحة تملأ الغرفة. أولادي بدأوا يطلبونها كل أحد مثل الساعة.",
      type: "customer",
      rating: 5,
      avatarUrl: "/molokhia.png",
    },
    {
      name: "Omar Fathy",
      nameAr: "عمر فتحي",
      quote: "Our team of 40 orders lunch from Get Mumm three times a week. Always on time, always hot, and every single person finishes their plate. That never happened with any other catering.",
      quoteAr: "فريقنا المكون من 40 شخصاً يطلب الغداء من Get Mumm ثلاث مرات أسبوعياً. دائماً في الوقت وساخن دائماً وكل شخص ينهي طبقه. هذا لم يحدث مع أي تقديم طعام آخر.",
      type: "office",
      rating: 5,
      avatarUrl: "/office_catering.png",
      company: "Nile Digital Agency",
      companyAr: "وكالة نايل ديجيتال",
      role: "Operations Manager",
      roleAr: "مدير العمليات",
    },
    {
      name: "Rania El-Desoky",
      nameAr: "رانيا الدسوقي",
      quote: "We tried five catering companies before Get Mumm. We are the only office where people ask for the chef's name after lunch. Samia's kofta is what converted us.",
      quoteAr: "جربنا خمس شركات تقديم طعام قبل Get Mumm. نحن المكتب الوحيد الذي يسأل فيه الناس عن اسم الطاهية بعد الغداء. كفتة سامية هي ما حوّلنا.",
      type: "office",
      rating: 5,
      avatarUrl: "/office_catering.png",
      company: "Maadi Architecture Studio",
      companyAr: "استوديو معادي للعمارة",
      role: "Founder",
      roleAr: "المؤسسة",
    },
    {
      name: "Yasmin Nour",
      nameAr: "ياسمين نور",
      quote: "I ordered Nadia's vine leaves for a dinner party of twelve. Every guest asked me which restaurant I used. When I said it was a home cook, no one believed me.",
      quoteAr: "طلبت ورق عنب نادية لعشاء من اثني عشر شخصاً. كل ضيف سألني أي مطعم استخدمت. حين قلت إنها طاهية منزلية، لم يصدق أحد.",
      type: "customer",
      rating: 5,
      avatarUrl: "/mahshi.png",
    },
  ]).returning();

  console.log(`  ✓ Inserted ${testimonials.length} testimonials`);

  const pool = getPoolForMigrations();
  await pool.end();
  console.log("\n✅ Database seeded successfully!\n");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
