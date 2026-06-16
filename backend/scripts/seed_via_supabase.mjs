import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function clearTables() {
  const tables = ['menu_items', 'testimonials', 'chefs', 'categories', 'blog_posts', 'subscription_plans', 'contacts', 'office_inquiries'];
  for (const t of tables) {
    // delete all rows: use a non-null id filter to remove all records
    const { error } = await supabase.from(t).delete().neq('id', 0);
    if (error) console.warn(`delete ${t}:`, error.message);
  }
}

async function seed() {
  console.log('Seeding Supabase using HTTP API...');

  await clearTables();

  const categories = [
    { name: 'Rice & Grain Dishes', name_ar: 'أطباق الأرز والحبوب', slug: 'rice-grains', description: "Egypt's beloved rice and grain staples — from street-side koshari to hearty ful medames and flaky fiteer.", description_ar: 'أشهر أطباق الأرز والحبوب المصرية — من كشري الشارع إلى الفول المدمس والفطير المشلتت.', image_url: '/koshari.png', item_count: 0 },
    { name: 'Stuffed Dishes', name_ar: 'محاشي', slug: 'stuffed', description: 'Tender vegetables and vine leaves lovingly stuffed with herbed rice, slow-cooked to perfection.', description_ar: 'خضروات وأوراق عنب محشوة بأرز معطر، مطبوخة على نار هادئة بعناية.', image_url: '/mahshi.png', item_count: 0 },
    { name: 'Meat Dishes', name_ar: 'أطباق اللحوم', slug: 'meat', description: 'Rich braised meats, festive fattah, and hand-rolled kofta grilled over charcoal.', description_ar: 'لحوم مشوية فاخرة وفتة الأعياد وكفتة محضّرة باليد على الفحم.', image_url: '/kofta.png', item_count: 0 },
    { name: 'Soups & Stews', name_ar: 'شوربات وطواجن', slug: 'soups-stews', description: 'Soul-warming molokhia, hearty lentil soup, and slow-simmered tagines.', description_ar: 'ملوخية دافئة للروح وشوربة عدس غنية وطواجن تُطهى على نار هادئة.', image_url: '/molokhia.png', item_count: 0 },
    { name: 'Salads & Sides', name_ar: 'سلطات ومقبلات', slug: 'salads-sides', description: 'Fresh garden salads, creamy tahini, smoky baba ghanoush, and seasonal mezze.', description_ar: 'سلطات طازجة وطحينة كريمية وبابا غنوج مدخن ومزة موسمية.', image_url: '/mahshi.png', item_count: 0 },
    { name: 'Desserts', name_ar: 'حلويات', slug: 'desserts', description: "Egypt's most beloved sweets — from warm umm ali to golden basbousa drizzled with honey.", description_ar: 'أشهر الحلويات المصرية — من أم علي الدافئة إلى البسبوسة الذهبية بالعسل.', image_url: '/umm_ali.png', item_count: 0 }
  ];

  const { error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' });
  if (catErr) throw catErr;

  const chefs = [
    { name: 'Umm Hassan', name_ar: 'أم حسن', bio: "A Cairo kitchen legend with 30 years perfecting street classics. Her koshari is the standard every vendor is measured against — three lentil layers, hand-fried onions, and a sauce made fresh every morning.", bio_ar: 'أسطورة مطبخ القاهرة بخبرة 30 عاماً في إتقان أكلات الشارع. كشريها هو المقياس الذي يُقاس به كل الباعة — ثلاث طبقات من العدس وبصل مقلي باليد وصلصة طازجة كل صباح.', image_url: '/chef1.png', specialties: ['Koshari','Ful Medames','Fiteer'], specialties_ar: ['كشري','فول مدمس','فطير'], item_count: 0, rating: 4.9, joined_year: 2016 },
    { name: 'Nadia Magdi', name_ar: 'نادية مجدي', bio: "Nadia inherited her grandmother's mahshi recipes from Alexandria and has spent two decades perfecting every stuffed leaf and vegetable. She rolls each vine leaf by hand — no machine, no shortcuts.", bio_ar: 'نادية ورثت وصفات جدتها في المحاشي من الإسكندرية وأمضت عقدين في إتقان كل ورقة وخضرة محشوة. تلف كل ورقة عنب باليد — بدون آلة ولا اختصارات.', image_url: '/chef2.png', specialties: ['Mahshi','Wara Einab','Stuffed Peppers'], specialties_ar: ['محشي','ورق عنب','فلفل محشي'], item_count: 0, rating: 4.8, joined_year: 2017 },
    { name: 'Samia Farouk', name_ar: 'سامية فاروق', bio: "Samia's Eid fattah became so famous her neighbours started ordering weeks in advance.", bio_ar: 'فتة سامية في العيد أصبحت شهيرة لدرجة أن جيرانها بدأوا يطلبون قبل أسابيع.', image_url: '/chef1.png', specialties: ['Fattah','Kofta','Hawawshi'], specialties_ar: ['فتة','كفتة','هواوشي'], item_count: 0, rating: 4.9, joined_year: 2015 },
    { name: 'Hanan Ibrahim', name_ar: 'حنان إبراهيم', bio: "Hanan's slow-cooked molokhia with rabbit is a Sunday institution in Giza.", bio_ar: 'ملوخية حنان المطبوخة ببطء مع الأرانب هي طقس يوم الأحد في الجيزة.', image_url: '/chef2.png', specialties: ['Molokhia','Lentil Soup','Chicken Tagine'], specialties_ar: ['ملوخية','شوربة عدس','طاجن دجاج'], item_count: 0, rating: 4.7, joined_year: 2018 },
    { name: 'Maha El-Sayed', name_ar: 'مها السيد', bio: "The undisputed queen of Egyptian desserts. Maha's umm ali is served warm with just the right balance of cream, pastry and toasted nuts.", bio_ar: 'الملكة غير المنازعة للحلويات المصرية. أم علي مها تُقدَّم دافئة بالتوازن الصحيح من الكريمة والعجينة والمكسرات.', image_url: '/chef1.png', specialties: ['Umm Ali','Basbousa','Konafa'], specialties_ar: ['أم علي','بسبوسة','كنافة'], item_count: 0, rating: 4.9, joined_year: 2019 }
  ];

  const { error: chefErr } = await supabase.from('chefs').upsert(chefs, { onConflict: 'name' });
  if (chefErr) throw chefErr;

  // Build a category map for ids
  const { data: cats, error: catsErr } = await supabase.from('categories').select('id,slug');
  if (catsErr) throw catsErr;
  const categoryBySlug = {};
  (cats || []).forEach(c => { categoryBySlug[c.slug] = c.id; });

  const menuItems = [
    { name: 'Koshari', name_ar: 'كُشري', description: "Egypt's iconic street dish — layers of rice, brown lentils, macaroni, crispy fried onions, tangy tomato sauce and a garlic-vinegar daqqa, all in one bowl.", description_ar: 'أشهر أكلة شعبية مصرية — طبقات من الأرز والعدس البني والمعكرونة والبصل المقلي المقرمش مع صلصة طماطم حامضة ودقة ثوم وخل في طبق واحد.', price: 65, category_id: categoryBySlug['rice-grains'] || null, category_name: 'Rice & Grain Dishes', category_name_ar: 'أطباق الأرز والحبوب', image_url: '/koshari.png', dietary: ['vegan'], is_available: true, is_featured: true, chef_name: 'Umm Hassan', chef_name_ar: 'أم حسن', rating: 4.9, prep_time_minutes: 30 },
    { name: 'Ful Medames', name_ar: 'فول مدمس', description: 'Slow-simmered fava beans with garlic, cumin, lemon and a generous drizzle of extra-virgin olive oil.', description_ar: 'فول مدمس مطبوخ ببطء مع الثوم والكمون والليمون ورذاذ سخي من زيت الزيتون.', price: 45, category_id: categoryBySlug['rice-grains'] || null, category_name: 'Rice & Grain Dishes', category_name_ar: 'أطباق الأرز والحبوب', image_url: '/koshari.png', dietary: ['vegan','gluten-free'], is_available: true, is_featured: false, chef_name: 'Umm Hassan', chef_name_ar: 'أم حسن', rating: 4.8, prep_time_minutes: 45 },
    { name: 'Stuffed Vine Leaves', name_ar: 'ورق عنب', description: 'Rolled vine leaves packed with herbed rice, diced tomato and a hint of lemon, slow-cooked in a pot lined with lamb ribs for a deep, rich flavour.', description_ar: 'أوراق عنب مفرودة محشوة بأرز معطر وطماطم مفرومة ورائحة الليمون، مطبوخة ببطء في طنجرة مبطنة بضلوع خروف لنكهة غنية وعميقة.', price: 140, category_id: categoryBySlug['stuffed'] || null, category_name: 'Stuffed Dishes', category_name_ar: 'محاشي', image_url: '/mahshi.png', dietary: ['vegan'], is_available: true, is_featured: true, chef_name: 'Nadia Magdi', chef_name_ar: 'نادية مجدي', rating: 4.9, prep_time_minutes: 90 },
    { name: 'Lamb Fattah', name_ar: 'فتة لحم ضأن', description: 'Crispy baladi bread, fragrant white rice and slow-braised whole lamb bathed in a rich garlic-vinegar broth.', description_ar: 'خبز بلدي مقرمش وأرز أبيض فاخر وخروف كامل مسلوق ببطء في مرق غني بالثوم والخل.', price: 235, category_id: categoryBySlug['meat'] || null, category_name: 'Meat Dishes', category_name_ar: 'أطباق اللحوم', image_url: '/fatta.png', dietary: [], is_available: true, is_featured: true, chef_name: 'Samia Farouk', chef_name_ar: 'سامية فاروق', rating: 4.9, prep_time_minutes: 120 },
    { name: 'Molokhia with Chicken', name_ar: 'ملوخية بالدجاج', description: "Silky jute leaves simmered low and slow in a rich free-range chicken broth, finished with a sizzling ta'leya of garlic and dried coriander poured tableside.", description_ar: 'أوراق ملوخية ناعمة تُطهى ببطء في مرق دجاج بلدي غني، منتهية بتقلية مقلية من الثوم والكسبرة المجففة تُسكب على الطاولة.', price: 130, category_id: categoryBySlug['soups-stews'] || null, category_name: 'Soups & Stews', category_name_ar: 'شوربات وطواجن', image_url: '/molokhia.png', dietary: ['gluten-free'], is_available: true, is_featured: false, chef_name: 'Hanan Ibrahim', chef_name_ar: 'حنان إبراهيم', rating: 4.8, prep_time_minutes: 50 }
  ];

  const { error: itemsErr } = await supabase.from('menu_items').insert(menuItems);
  if (itemsErr) console.warn('menu_items insert warning:', itemsErr.message);

  // Update item counts (fallback approach if no DB function exists)
  const { data: chefsList } = await supabase.from('chefs').select('name');
  for (const c of chefsList || []) {
    const { data: count } = await supabase.from('menu_items').select('id', { count: 'exact' }).eq('chef_name', c.name);
    await supabase.from('chefs').update({ item_count: (count && count.length) || 0 }).eq('name', c.name);
  }

  const { data: categoriesList } = await supabase.from('categories').select('id');
  for (const c of categoriesList || []) {
    const { data: count } = await supabase.from('menu_items').select('id', { count: 'exact' }).eq('category_id', c.id);
    await supabase.from('categories').update({ item_count: (count && count.length) || 0 }).eq('id', c.id);
  }

  const testimonials = [
    { name: 'Layla Hassan', name_ar: 'ليلى حسن', quote: "Umm Hassan's koshari brought back memories...", quote_ar: 'كشري أم حسن أعاد لي ذكريات...', type: 'customer', rating: 5, avatar_url: '/koshari.png' },
    { name: 'Ahmed Kamal', name_ar: 'أحمد كمال', quote: "Nadia's mixed mahshi platter — my entire family...", quote_ar: 'طبق محاشي نادية المشكل...', type: 'customer', rating: 5, avatar_url: '/mahshi.png' }
  ];
  const { error: testErr } = await supabase.from('testimonials').insert(testimonials);
  if (testErr) console.warn('testimonials insert:', testErr.message);

  const blogPosts = [
    { title: 'How to Make the Perfect Koshari', title_ar: 'كيف تصنع الكشري المثالي', slug: 'how-to-make-koshari', excerpt: 'A step-by-step guide to layering rice, lentils and macaroni for the perfect koshari.', excerpt_ar: 'دليل خطوة بخطوة...', content: 'Full content about making koshari...', content_ar: 'محتوى كامل عن كيفية صنع الكشري...', image_url: '/koshari.png', published_at: new Date().toISOString(), author: 'Get Mumm Team', author_ar: 'فريق Get Mumm', tags: ['koshari','street-food'] }
  ];
  const { error: blogErr } = await supabase.from('blog_posts').upsert(blogPosts, { onConflict: 'slug' });
  if (blogErr) console.warn('blog_posts upsert:', blogErr.message);

  const plans = [
    { name: 'Monthly Individual', name_ar: 'شهري فردي', description: 'Access to an individual monthly plan with 2 lunches per week.', description_ar: 'وصول لخطة شهرية فردية مع وجبتين في الأسبوع.', price: 49.99, period: 'monthly', features: ['2 lunches / week','Priority support'], features_ar: ['وجبتان في الأسبوع','دعم أولوية'], is_popular: false, target_audience: 'individual' },
    { name: 'Office Team', name_ar: 'فريق مكاتب', description: 'Tailored office catering with flexible head-count and delivery windows.', description_ar: 'خدمة تقديم طعام مكتبية مخصصة مع عدد أشخاص وتوقيتات توصيل مرنة.', price: 499.0, period: 'monthly', features: ['Flexible head count','Weekly delivery windows','Dedicated account manager'], features_ar: ['عدد أشخاص مرن','مواعيد توصيل أسبوعية','مدير حساب مخصص'], is_popular: true, target_audience: 'office' }
  ];
  const { error: planErr } = await supabase.from('subscription_plans').upsert(plans, { onConflict: 'name' });
  if (planErr) console.warn('plans upsert:', planErr.message);

  const { error: contactErr } = await supabase.from('contacts').insert([{ name: 'Test User', email: 'test@example.com', phone: '+201001234567', message: 'I have a question about catering options.', subject: 'Catering question' }]);
  if (contactErr) console.warn('contacts insert:', contactErr.message);

  const { error: officeErr } = await supabase.from('office_inquiries').insert([{ company_name: 'Nile Digital Agency', contact_name: 'Omar Fathy', email: 'omar@nil.com', phone: '+201009876543', head_count: 40, delivery_area: 'Maadi', frequency: 'weekly', message: 'Looking for weekly team lunches for 40 people.' }]);
  if (officeErr) console.warn('office_inquiries insert:', officeErr.message);

  console.log('Seeding complete.');
}

seed().catch((err) => { console.error('Seeding failed:', err); process.exit(1); });

/*
Run this script from the backend folder after setting SUPABASE_SERVICE_ROLE_KEY in backend/.env:

node scripts/seed_via_supabase.mjs

Note: the script uses simple deletion logic; if you need safe upserts or more complex migrations, adjust accordingly.
*/
