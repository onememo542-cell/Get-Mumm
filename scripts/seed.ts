import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../lib/db/src/schema/index.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const {
  categoriesTable,
  chefsTable,
  menuItemsTable,
  testimonialsTable,
} = schema;

async function main() {
  console.log("🌱 Seeding Get Mumm database…");

  /* ── Wipe in dependency order ───────────────────────────────────────── */
  await db.delete(menuItemsTable);
  await db.delete(testimonialsTable);
  await db.delete(chefsTable);
  await db.delete(categoriesTable);
  console.log("  ✓ Cleared existing data");

  /* ── Categories ─────────────────────────────────────────────────────── */
  const cats = await db
    .insert(categoriesTable)
    .values([
      {
        name: "Rice & Grain Dishes",
        nameAr: "أطباق الأرز والحبوب",
        slug: "rice-grains",
        description: "Egypt's beloved rice and grain staples — from street-side koshari to hearty ful medames.",
        descriptionAr: "أشهر أطباق الأرز والحبوب المصرية — من كشري الشارع إلى الفول المدمس الغني.",
        imageUrl: "/koshari.png",
        itemCount: 0,
      },
      {
        name: "Stuffed Dishes",
        nameAr: "محاشي",
        slug: "stuffed",
        description: "Tender vegetables and vine leaves lovingly stuffed with herbed rice — slow-cooked to perfection.",
        descriptionAr: "خضروات وأوراق عنب محشوة بأرز معطر بالأعشاب — مطبوخة على نار هادئة بعناية.",
        imageUrl: "/mahshi.png",
        itemCount: 0,
      },
      {
        name: "Meat Dishes",
        nameAr: "أطباق اللحوم",
        slug: "meat",
        description: "Rich braised meats, festive fattah, and hand-rolled kofta grilled over charcoal.",
        descriptionAr: "لحوم مشوية فاخرة وفتة الأعياد وكفتة محضّرة باليد على الفحم.",
        imageUrl: "/fatta.png",
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
        imageUrl: "/kofta.png",
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
    ])
    .returning();

  console.log(`  ✓ Inserted ${cats.length} categories`);

  const catBySlug = Object.fromEntries(cats.map((c) => [c.slug, c]));

  /* ── Chefs ───────────────────────────────────────────────────────────── */
  const chefs = await db
    .insert(chefsTable)
    .values([
      {
        name: "Umm Hassan",
        nameAr: "أم حسن",
        bio: "A Cairo kitchen legend with 30 years perfecting street classics. Her koshari is the standard every vendor is measured against.",
        bioAr: "أسطورة مطبخ القاهرة مع 30 عاماً في إتقان أكلات الشارع. كشريها هو المقياس الذي يُقاس به كل الباعة.",
        imageUrl: "/koshari.png",
        specialties: ["Koshari", "Ful Medames", "Fiteer"],
        specialtiesAr: ["كشري", "فول مدمس", "فطير"],
        itemCount: 0,
        rating: 4.9,
        joinedYear: 2016,
      },
      {
        name: "Nadia Magdi",
        nameAr: "نادية مجدي",
        bio: "Nadia inherited her grandmother's recipes for mahshi and has spent two decades making every leaf perfect. Her stuffed vine leaves melt in the mouth.",
        bioAr: "نادية ورثت وصفات جدتها في المحاشي وأمضت عقدين في جعل كل ورقة مثالية. محشي ورق العنب لديها يذوب في الفم.",
        imageUrl: "/mahshi.png",
        specialties: ["Mahshi", "Stuffed Peppers", "Wara Einab"],
        specialtiesAr: ["محشي", "فلفل محشي", "ورق عنب"],
        itemCount: 0,
        rating: 4.8,
        joinedYear: 2017,
      },
      {
        name: "Samia Farouk",
        nameAr: "سامية فاروق",
        bio: "Samia's Eid fattah became so famous her neighbours started ordering weeks in advance. Her kofta has a secret blend of seven spices.",
        bioAr: "فتة سامية في العيد أصبحت شهيرة لدرجة أن جيرانها بدأوا يطلبون قبل أسابيع. كفتتها لها مزيج سري من سبع بهارات.",
        imageUrl: "/fatta.png",
        specialties: ["Fattah", "Kofta", "Hawawshi"],
        specialtiesAr: ["فتة", "كفتة", "هواوشي"],
        itemCount: 0,
        rating: 4.9,
        joinedYear: 2015,
      },
      {
        name: "Hanan Ibrahim",
        nameAr: "حنان إبراهيم",
        bio: "Hanan's slow-cooked molokhia with rabbit is a Sunday institution in Giza. Her lentil soup has won hearts across three generations of one family.",
        bioAr: "ملوخية حنان المطبوخة ببطء مع الأرانب هي طقس يوم الأحد في الجيزة. شوربة عدسها فازت بقلوب ثلاثة أجيال من عائلة واحدة.",
        imageUrl: "/molokhia.png",
        specialties: ["Molokhia", "Lentil Soup", "Chicken Tagine"],
        specialtiesAr: ["ملوخية", "شوربة عدس", "طاجن دجاج"],
        itemCount: 0,
        rating: 4.7,
        joinedYear: 2018,
      },
      {
        name: "Maha El-Sayed",
        nameAr: "مها السيد",
        bio: "The undisputed queen of Egyptian desserts. Maha's umm ali is served warm with just the right balance of cream, pastry and toasted nuts.",
        bioAr: "الملكة غير المنازعة للحلويات المصرية. أم علي مها تُقدَّم دافئة بالتوازن الصحيح من الكريمة والعجينة والمكسرات المحمصة.",
        imageUrl: "/umm_ali.png",
        specialties: ["Umm Ali", "Basbousa", "Konafa"],
        specialtiesAr: ["أم علي", "بسبوسة", "كنافة"],
        itemCount: 0,
        rating: 4.9,
        joinedYear: 2019,
      },
    ])
    .returning();

  console.log(`  ✓ Inserted ${chefs.length} chefs`);

  const chefByName: Record<string, typeof chefs[0]> = {};
  for (const c of chefs) chefByName[c.name] = c;

  /* ── Menu Items ──────────────────────────────────────────────────────── */
  const items = await db
    .insert(menuItemsTable)
    .values([
      /* ── Rice & Grains ── */
      {
        name: "Koshari",
        nameAr: "كُشري",
        description: "Egypt's iconic street dish — rice, pasta, lentils, crispy onions and spicy tomato sauce all in one bowl.",
        descriptionAr: "أشهر أكلة شعبية مصرية — أرز ومعكرونة وعدس وبصل مقلي مع صلصة طماطم حارة في طبق واحد.",
        price: 65,
        categoryId: catBySlug["rice-grains"].id,
        categoryName: "Rice & Grain Dishes",
        categoryNameAr: "أطباق الأرز والحبوب",
        imageUrl: "/koshari.png",
        dietary: ["vegan", "gluten-free"],
        isAvailable: true,
        isFeatured: true,
        chefName: "Umm Hassan",
        chefNameAr: "أم حسن",
        rating: 4.9,
        prepTimeMinutes: 30,
      },
      {
        name: "Ful Medames",
        nameAr: "فول مدمس",
        description: "Slow-simmered fava beans with garlic, lemon and a drizzle of extra-virgin olive oil. Egypt's breakfast staple.",
        descriptionAr: "فول مدمس مطبوخ ببطء مع الثوم والليمون ورذاذ من زيت الزيتون. وجبة الإفطار المصرية الأصيلة.",
        price: 45,
        categoryId: catBySlug["rice-grains"].id,
        categoryName: "Rice & Grain Dishes",
        categoryNameAr: "أطباق الأرز والحبوب",
        imageUrl: "/koshari.png",
        dietary: ["vegan"],
        isAvailable: true,
        isFeatured: false,
        chefName: "Umm Hassan",
        chefNameAr: "أم حسن",
        rating: 4.8,
        prepTimeMinutes: 45,
      },
      {
        name: "Macarona Béchamel",
        nameAr: "مكرونة بشاميل",
        description: "Layered pasta baked with spiced minced meat and a creamy golden béchamel — Egypt's answer to lasagne.",
        descriptionAr: "مكرونة متعددة الطبقات مخبوزة مع لحم مفروم متبل وبشاميل كريمي ذهبي — اللازانيا بلمسة مصرية.",
        price: 110,
        categoryId: catBySlug["rice-grains"].id,
        categoryName: "Rice & Grain Dishes",
        categoryNameAr: "أطباق الأرز والحبوب",
        imageUrl: "/fatta.png",
        dietary: [],
        isAvailable: true,
        isFeatured: false,
        chefName: "Umm Hassan",
        chefNameAr: "أم حسن",
        rating: 4.7,
        prepTimeMinutes: 60,
      },

      /* ── Stuffed Dishes ── */
      {
        name: "Stuffed Vine Leaves (Wara Einab)",
        nameAr: "ورق عنب",
        description: "Rolled vine leaves packed with herbed rice and a hint of lemon, slow-cooked until perfectly tender.",
        descriptionAr: "أوراق عنب مفرودة محشوة بأرز معطر ورائحة الليمون، مطبوخة ببطء حتى تصبح طرية تماماً.",
        price: 140,
        categoryId: catBySlug["stuffed"].id,
        categoryName: "Stuffed Dishes",
        categoryNameAr: "محاشي",
        imageUrl: "/mahshi.png",
        dietary: ["vegan"],
        isAvailable: true,
        isFeatured: true,
        chefName: "Nadia Magdi",
        chefNameAr: "نادية مجدي",
        rating: 4.9,
        prepTimeMinutes: 90,
      },
      {
        name: "Mixed Mahshi Platter",
        nameAr: "طبق محاشي مشكل",
        description: "Zucchini, peppers, and cabbage all stuffed with herbed rice — a celebration of Egypt's most cherished dish.",
        descriptionAr: "كوسة وفلفل وكرنب محشو بأرز معطر — احتفال بأشهر الأطباق المصرية المحبوبة.",
        price: 165,
        categoryId: catBySlug["stuffed"].id,
        categoryName: "Stuffed Dishes",
        categoryNameAr: "محاشي",
        imageUrl: "/mahshi.png",
        dietary: ["vegan"],
        isAvailable: true,
        isFeatured: false,
        chefName: "Nadia Magdi",
        chefNameAr: "نادية مجدي",
        rating: 4.8,
        prepTimeMinutes: 100,
      },

      /* ── Meat Dishes ── */
      {
        name: "Lamb Fattah",
        nameAr: "فتة لحم ضأن",
        description: "Crispy bread, fragrant rice and slow-braised lamb bathed in rich garlic-vinegar broth with toasted almonds.",
        descriptionAr: "خبز مقرمش وأرز فاخر ولحم ضأن في مرق غني بالثوم والخل مع اللوز المحمص.",
        price: 235,
        categoryId: catBySlug["meat"].id,
        categoryName: "Meat Dishes",
        categoryNameAr: "أطباق اللحوم",
        imageUrl: "/fatta.png",
        dietary: [],
        isAvailable: true,
        isFeatured: true,
        chefName: "Samia Farouk",
        chefNameAr: "سامية فاروق",
        rating: 4.9,
        prepTimeMinutes: 120,
      },
      {
        name: "Grilled Kofta",
        nameAr: "كفتة مشوية",
        description: "Hand-rolled ground beef and lamb kofta, seasoned with seven spices and charcoal-grilled to perfection.",
        descriptionAr: "كفتة لحم بقر وضأن مفرود باليد، متبلة بسبع بهارات ومشوية على الفحم بإتقان.",
        price: 155,
        categoryId: catBySlug["meat"].id,
        categoryName: "Meat Dishes",
        categoryNameAr: "أطباق اللحوم",
        imageUrl: "/kofta.png",
        dietary: [],
        isAvailable: true,
        isFeatured: true,
        chefName: "Samia Farouk",
        chefNameAr: "سامية فاروق",
        rating: 4.8,
        prepTimeMinutes: 40,
      },
      {
        name: "Hawawshi",
        nameAr: "هواوشي",
        description: "Minced spiced meat baked inside crispy baladi bread — Cairo's most iconic stuffed sandwich.",
        descriptionAr: "لحم مفروم متبل مخبوز داخل خبز بلدي مقرمش — أشهر ساندويتش محشو في القاهرة.",
        price: 95,
        categoryId: catBySlug["meat"].id,
        categoryName: "Meat Dishes",
        categoryNameAr: "أطباق اللحوم",
        imageUrl: "/kofta.png",
        dietary: [],
        isAvailable: true,
        isFeatured: false,
        chefName: "Samia Farouk",
        chefNameAr: "سامية فاروق",
        rating: 4.7,
        prepTimeMinutes: 35,
      },

      /* ── Soups & Stews ── */
      {
        name: "Molokhia with Chicken",
        nameAr: "ملوخية بالدجاج",
        description: "Silky jute leaves simmered in a rich chicken broth with a sizzling garlic and coriander ta'leya.",
        descriptionAr: "أوراق ملوخية ناعمة في مرق دجاج غني مع تقلية ثوم وكسبرة مقلية.",
        price: 130,
        categoryId: catBySlug["soups-stews"].id,
        categoryName: "Soups & Stews",
        categoryNameAr: "شوربات وطواجن",
        imageUrl: "/molokhia.png",
        dietary: ["gluten-free"],
        isAvailable: true,
        isFeatured: false,
        chefName: "Hanan Ibrahim",
        chefNameAr: "حنان إبراهيم",
        rating: 4.8,
        prepTimeMinutes: 50,
      },
      {
        name: "Shorbet Ads (Lentil Soup)",
        nameAr: "شوربة عدس",
        description: "Velvety red lentil soup with roasted cumin, lemon and a swirl of golden fried onions.",
        descriptionAr: "شوربة عدس أحمر مخملية مع كمون محمص وليمون وحلقات بصل مقلية ذهبية.",
        price: 75,
        categoryId: catBySlug["soups-stews"].id,
        categoryName: "Soups & Stews",
        categoryNameAr: "شوربات وطواجن",
        imageUrl: "/molokhia.png",
        dietary: ["vegan", "gluten-free"],
        isAvailable: true,
        isFeatured: false,
        chefName: "Hanan Ibrahim",
        chefNameAr: "حنان إبراهيم",
        rating: 4.7,
        prepTimeMinutes: 35,
      },
      {
        name: "Chicken Tagine with Vegetables",
        nameAr: "طاجن دجاج بالخضار",
        description: "Free-range chicken braised in a clay tagine with seasonal vegetables, saffron, and preserved lemon.",
        descriptionAr: "دجاج بلدي مطبوخ في طاجن فخار مع خضار موسمية وزعفران وليمون مخلل.",
        price: 175,
        categoryId: catBySlug["soups-stews"].id,
        categoryName: "Soups & Stews",
        categoryNameAr: "شوربات وطواجن",
        imageUrl: "/molokhia.png",
        dietary: ["gluten-free"],
        isAvailable: true,
        isFeatured: false,
        chefName: "Hanan Ibrahim",
        chefNameAr: "حنان إبراهيم",
        rating: 4.8,
        prepTimeMinutes: 80,
      },

      /* ── Salads & Sides ── */
      {
        name: "Salata Baladi",
        nameAr: "سلطة بلدي",
        description: "Classic Egyptian village salad of tomato, cucumber, red onion and parsley in a lemony dressing.",
        descriptionAr: "السلطة البلدية المصرية الكلاسيكية من طماطم وخيار وبصل أحمر وبقدونس مع تتبيلة الليمون.",
        price: 55,
        categoryId: catBySlug["salads-sides"].id,
        categoryName: "Salads & Sides",
        categoryNameAr: "سلطات ومقبلات",
        imageUrl: "/kofta.png",
        dietary: ["vegan", "gluten-free"],
        isAvailable: true,
        isFeatured: false,
        chefName: "Umm Hassan",
        chefNameAr: "أم حسن",
        rating: 4.6,
        prepTimeMinutes: 10,
      },
      {
        name: "Tahini & Baba Ghanoush",
        nameAr: "طحينة وبابا غنوج",
        description: "Freshly ground sesame tahini and flame-roasted aubergine dip served with warm baladi bread.",
        descriptionAr: "طحينة سمسم طازجة ومتبل باذنجان محمص على النار مع خبز بلدي دافئ.",
        price: 70,
        categoryId: catBySlug["salads-sides"].id,
        categoryName: "Salads & Sides",
        categoryNameAr: "سلطات ومقبلات",
        imageUrl: "/kofta.png",
        dietary: ["vegan"],
        isAvailable: true,
        isFeatured: false,
        chefName: "Nadia Magdi",
        chefNameAr: "نادية مجدي",
        rating: 4.7,
        prepTimeMinutes: 15,
      },

      /* ── Desserts ── */
      {
        name: "Umm Ali",
        nameAr: "أم علي",
        description: "Egypt's most beloved dessert — warm puff pastry soaked in cream, scattered with toasted nuts and coconut.",
        descriptionAr: "أشهر حلوى مصرية — عجينة منفوخة دافئة مغمورة في الكريمة مع مكسرات وجوز هند محمص.",
        price: 85,
        categoryId: catBySlug["desserts"].id,
        categoryName: "Desserts",
        categoryNameAr: "حلويات",
        imageUrl: "/umm_ali.png",
        dietary: [],
        isAvailable: true,
        isFeatured: true,
        chefName: "Maha El-Sayed",
        chefNameAr: "مها السيد",
        rating: 4.9,
        prepTimeMinutes: 25,
      },
      {
        name: "Basbousa bil Ashta",
        nameAr: "بسبوسة بالقشطة",
        description: "Golden semolina cake soaked in rose-scented syrup, topped with thick ashta cream and crushed pistachios.",
        descriptionAr: "كيكة سميد ذهبية منقوعة في قطر بماء الورد، مزينة بالقشطة الكثيفة والفستق المطحون.",
        price: 75,
        categoryId: catBySlug["desserts"].id,
        categoryName: "Desserts",
        categoryNameAr: "حلويات",
        imageUrl: "/umm_ali.png",
        dietary: [],
        isAvailable: true,
        isFeatured: false,
        chefName: "Maha El-Sayed",
        chefNameAr: "مها السيد",
        rating: 4.8,
        prepTimeMinutes: 20,
      },
      {
        name: "Konafa bil Goz el-Hend",
        nameAr: "كنافة بجوز الهند",
        description: "Shredded filo pastry filled with sweet cream cheese and coconut, baked until golden and drizzled with honey syrup.",
        descriptionAr: "عجينة كنافة محشوة بجبنة قشطة حلوة وجوز هند، مخبوزة حتى تصبح ذهبية وتُرش بالعسل.",
        price: 95,
        categoryId: catBySlug["desserts"].id,
        categoryName: "Desserts",
        categoryNameAr: "حلويات",
        imageUrl: "/umm_ali.png",
        dietary: [],
        isAvailable: true,
        isFeatured: false,
        chefName: "Maha El-Sayed",
        chefNameAr: "مها السيد",
        rating: 4.9,
        prepTimeMinutes: 30,
      },
    ])
    .returning();

  console.log(`  ✓ Inserted ${items.length} menu items`);

  /* ── Testimonials ────────────────────────────────────────────────────── */
  const testimonials = await db
    .insert(testimonialsTable)
    .values([
      {
        name: "Layla Hassan",
        nameAr: "ليلى حسن",
        quote: "The koshari brought back memories of my grandmother's kitchen. Absolutely authentic — I've ordered every week for three months!",
        quoteAr: "الكشري أعاد ذكريات مطبخ جدتي. أصيل تماماً — طلبت كل أسبوع لمدة ثلاثة أشهر!",
        type: "customer",
        rating: 5,
        avatarUrl: "/koshari.png",
        company: null,
        companyAr: null,
        role: null,
        roleAr: null,
      },
      {
        name: "Ahmed Kamal",
        nameAr: "أحمد كمال",
        quote: "Nadia's mahshi is unbelievable. My entire family argued over who got the last piece — that's the highest compliment I can give.",
        quoteAr: "محاشي نادية لا تصدق. تجادلت عائلتي بأكملها على آخر قطعة — هذا أعلى مديح أستطيع تقديمه.",
        type: "customer",
        rating: 5,
        avatarUrl: "/mahshi.png",
        company: null,
        companyAr: null,
        role: null,
        roleAr: null,
      },
      {
        name: "Dina Samir",
        nameAr: "دينا سمير",
        quote: "Get Mumm changed our weekly family dinners. The fattah for Eid was exactly what I imagined but could never make myself.",
        quoteAr: "غيّرت Get Mumm عشاءاتنا العائلية الأسبوعية. فتة العيد كانت بالضبط ما تخيلته لكن لم أستطع صنعه بنفسي.",
        type: "customer",
        rating: 5,
        avatarUrl: "/fatta.png",
        company: null,
        companyAr: null,
        role: null,
        roleAr: null,
      },
      {
        name: "Omar Fathy",
        nameAr: "عمر فتحي",
        quote: "Our team of 40 orders lunch from Get Mumm three times a week. The food is always on time, warm, and everyone looks forward to it.",
        quoteAr: "فريقنا المكون من 40 شخصاً يطلب الغداء من Get Mumm ثلاث مرات أسبوعياً. الطعام دائماً في الوقت المحدد ودافئ والجميع يتطلع إليه.",
        type: "office",
        rating: 5,
        avatarUrl: "/kofta.png",
        company: "Nile Digital Agency",
        companyAr: "وكالة نايل ديجيتال",
        role: "Operations Manager",
        roleAr: "مدير العمليات",
      },
      {
        name: "Rania El-Desoky",
        nameAr: "رانيا الدسوقي",
        quote: "We've tried five different catering companies. Get Mumm is the only one where people actually finish their plates — and ask for the chef's name.",
        quoteAr: "جربنا خمس شركات تقديم طعام مختلفة. Get Mumm هي الوحيدة التي ينهي فيها الناس أطباقهم فعلاً ويسألون عن اسم الطاهية.",
        type: "office",
        rating: 5,
        avatarUrl: "/molokhia.png",
        company: "Maadi Architecture Studio",
        companyAr: "استوديو معادي للعمارة",
        role: "Founder",
        roleAr: "المؤسسة",
      },
      {
        name: "Sara Mostafa",
        nameAr: "سارة مصطفى",
        quote: "Maha's umm ali arrived warm, creamy and perfect. I closed my eyes and I was back in my mother's kitchen. Five stars is not enough.",
        quoteAr: "وصلت أم علي مها دافئة وكريمية ومثالية. أغمضت عيني وعدت إلى مطبخ أمي. خمس نجوم لا تكفي.",
        type: "customer",
        rating: 5,
        avatarUrl: "/umm_ali.png",
        company: null,
        companyAr: null,
        role: null,
        roleAr: null,
      },
    ])
    .returning();

  console.log(`  ✓ Inserted ${testimonials.length} testimonials`);

  await pool.end();
  console.log("\n✅ Database seeded successfully!\n");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
