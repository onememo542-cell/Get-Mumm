#!/usr/bin/env node
/**
 * Database seed script — run after `pnpm --filter db push`
 * Usage: node scripts/seed.mjs
 */
import { execSync } from "child_process";

const db = process.env.DATABASE_URL;
if (!db) throw new Error("DATABASE_URL is not set");

function sql(query) {
  execSync(`psql "${db}" -c ${JSON.stringify(query)}`, { stdio: "inherit" });
}

console.log("🌱 Seeding database...");

sql(`
INSERT INTO categories (name, name_ar, slug, description, description_ar, image_url, item_count)
VALUES
  ('Family Dining', 'مائدة العائلة', 'family-dining', 'Hearty dishes perfect for the whole family', 'أطباق دسمة مثالية للعائلة كلها', '/family_dining.png', 0),
  ('Office Catering', 'كيترينج الشركات', 'office-catering', 'Bulk orders for corporate teams', 'طلبات كبيرة للفرق المؤسسية', '/office_catering.png', 0),
  ('Egyptian Classics', 'الكلاسيكيات المصرية', 'egyptian-classics', 'Authentic traditional Egyptian recipes', 'وصفات مصرية تقليدية أصيلة', '/koshari.png', 0),
  ('Healthy Picks', 'الاختيارات الصحية', 'healthy-picks', 'Light and nutritious homemade options', 'خيارات منزلية خفيفة ومغذية', '/molokhia.png', 0)
ON CONFLICT (slug) DO NOTHING;
`);
console.log("✓ Categories");

sql(`
INSERT INTO chefs (name, name_ar, bio, bio_ar, image_url, specialties, specialties_ar, rating, joined_year, item_count)
VALUES
  ('Nadia Hassan', 'نادية حسن', 'A third-generation home cook from Zamalek. Her koshari and molokhia are legendary among regulars.', 'طاهية منزلية من الجيل الثالث من الزمالك.', '/chef1.png', ARRAY['Egyptian Classics', 'Family Meals'], ARRAY['الكلاسيكيات المصرية', 'وجبات العائلة'], 4.9, 2017, 12),
  ('Samira El-Masry', 'سميرة المصري', 'Born in Alexandria, Samira specializes in seafood, stuffed vegetables, and her famous Om Ali.', 'ولدت في الإسكندرية. تتخصص في المأكولات البحرية والخضروات المحشية وأم عليها الشهيرة.', '/chef2.png', ARRAY['Seafood', 'Desserts', 'Alexandrian Cuisine'], ARRAY['مأكولات بحرية', 'حلويات', 'مطبخ إسكندراني'], 4.8, 2019, 9),
  ('Heba Farouk', 'هبة فاروق', 'A nutritionist turned home chef creating healthy Egyptian dishes without compromising on taste.', 'اختصاصية تغذية تحولت إلى طاهية منزلية تبتكر أطباقًا مصرية صحية.', '/chef1.png', ARRAY['Healthy Cooking', 'Salads', 'Low-Calorie'], ARRAY['الطبخ الصحي', 'سلطات', 'قليل السعرات'], 4.7, 2020, 7)
ON CONFLICT DO NOTHING;
`);
console.log("✓ Chefs");

sql(`
INSERT INTO menu_items (name, name_ar, description, description_ar, price, category_id, category_name, category_name_ar, image_url, dietary, chef_name, chef_name_ar, rating, prep_time_minutes, is_featured, is_available)
SELECT v.name, v.name_ar, v.description, v.description_ar, v.price, c.id, c.name, c.name_ar, v.image_url, v.dietary, v.chef_name, v.chef_name_ar, v.rating, v.prep_time_minutes, v.is_featured, true
FROM (VALUES
  ('Koshari', 'كشري', 'Egypt''s beloved street food — lentils, rice, pasta and crispy onions topped with spicy tomato sauce.', 'أشهر أكلة مصرية شعبية — عدس وأرز ومكرونة وبصل مقرمش مع صلصة طماطم حارة.', 45.0, 'egyptian-classics', '/koshari.png', ARRAY['vegan','vegetarian','halal'], 'Nadia Hassan', 'نادية حسن', 4.9, 25, true),
  ('Molokhia with Chicken', 'ملوخية بالفراخ', 'Classic green molokhia soup cooked with tender chicken pieces, served with fluffy white rice.', 'حساء الملوخية الأخضر الكلاسيكي مطبوخ مع قطع دجاج طرية، يقدم مع الأرز الأبيض.', 65.0, 'egyptian-classics', '/molokhia.png', ARRAY['halal'], 'Nadia Hassan', 'نادية حسن', 4.7, 45, true),
  ('Kofta Plate', 'طبق كفتة', 'Grilled spiced minced meat kofta skewers served with bread, salad, and tahini sauce.', 'أسياخ كفتة لحم مفروم متبل مشوي تقدم مع خبز وسلطة وصلصة طحينة.', 75.0, 'egyptian-classics', '/kofta.png', ARRAY['halal'], 'Samira El-Masry', 'سميرة المصري', 4.8, 30, false),
  ('Fatta', 'فتة', 'Traditional Egyptian Fatta — layers of crispy bread, rice, and tender beef in rich garlic-tomato sauce.', 'فتة مصرية تقليدية — طبقات من الخبز المقرمش والأرز واللحم الطري في صلصة ثوم وطماطم.', 85.0, 'egyptian-classics', '/fatta.png', ARRAY['halal'], 'Nadia Hassan', 'نادية حسن', 4.6, 50, true),
  ('Mahshi', 'محشي', 'Stuffed vegetables — zucchini, peppers and grape leaves filled with spiced rice and herbs.', 'خضروات محشية — كوسة وفلفل وورق عنب محشو أرز وأعشاب متبلة.', 70.0, 'family-dining', '/mahshi.png', ARRAY['vegetarian','halal'], 'Samira El-Masry', 'سميرة المصري', 4.8, 60, true),
  ('Om Ali', 'أم علي', 'Egypt''s iconic dessert — a warm bread pudding baked with cream, nuts and raisins until golden.', 'حلوى مصرية أيقونية — بودينج خبز دافئ مخبوز بالكريمة والمكسرات والزبيب حتى يصبح ذهبيًا.', 55.0, 'egyptian-classics', '/umm_ali.png', ARRAY['vegetarian','halal'], 'Samira El-Masry', 'سميرة المصري', 4.9, 35, true),
  ('Family Rice Platter', 'طبق أرز عائلي', 'A generous platter of Egyptian-style rice with vermicelli and rich beef stew. Feeds 4-6.', 'طبق سخي من الأرز بالشعيرية مع يخنة لحم غنية. يكفي 4-6 أفراد.', 180.0, 'family-dining', '/family_dining.png', ARRAY['halal'], 'Nadia Hassan', 'نادية حسن', 4.7, 55, false),
  ('Green Salad Bowl', 'طبق سلطة خضراء', 'Fresh seasonal salad with cucumber, tomatoes, parsley and a lemon-olive oil dressing.', 'سلطة موسمية طازجة بالخيار والطماطم والبقدونس وتتبيلة الليمون وزيت الزيتون.', 35.0, 'healthy-picks', '/molokhia.png', ARRAY['vegan','vegetarian','gluten_free','low_cal','halal'], 'Heba Farouk', 'هبة فاروق', 4.5, 10, false),
  ('Stuffed Pigeon', 'حمام محشي', 'A Cairo delicacy — whole pigeon stuffed with seasoned freekeh wheat and slow-roasted to perfection.', 'شهية قاهرية — حمام كامل محشو بالفريك المتبل ومشوي ببطء حتى الكمال.', 95.0, 'egyptian-classics', '/kofta.png', ARRAY['halal'], 'Nadia Hassan', 'نادية حسن', 4.6, 70, false),
  ('Vegetable Soup', 'شوربة خضار', 'Hearty homemade vegetable soup with seasonal vegetables, chickpeas and fragrant spices.', 'شوربة خضار منزلية دسمة بالخضروات الموسمية والحمص والبهارات العطرية.', 40.0, 'healthy-picks', '/molokhia.png', ARRAY['vegan','vegetarian','low_cal','halal'], 'Heba Farouk', 'هبة فاروق', 4.4, 30, false),
  ('Office Lunch Box', 'صندوق غداء المكتب', 'A complete balanced lunch with a main dish, salad, and bread — perfect for office catering.', 'غداء متكامل ومتوازن مع طبق رئيسي وسلطة وخبز — مثالي لكيترينج المكاتب.', 55.0, 'office-catering', '/office_catering.png', ARRAY['halal'], 'Heba Farouk', 'هبة فاروق', 4.6, 20, false),
  ('Team Platter', 'طبق الفريق', 'A large sharing platter of mixed Egyptian dishes — great for team lunches and meetings.', 'طبق مشترك كبير من الأطباق المصرية المختلطة — رائع لغداء الفريق والاجتماعات.', 250.0, 'office-catering', '/family_dining.png', ARRAY['halal'], 'Nadia Hassan', 'نادية حسن', 4.8, 40, true)
) AS v(name, name_ar, description, description_ar, price, cat_slug, image_url, dietary, chef_name, chef_name_ar, rating, prep_time_minutes, is_featured)
JOIN categories c ON c.slug = v.cat_slug
ON CONFLICT DO NOTHING;
`);
console.log("✓ Menu items");

sql(`
INSERT INTO testimonials (name, name_ar, quote, quote_ar, rating, avatar_url, role, role_ar)
VALUES
  ('Ahmed Kamal', 'أحمد كمال', 'Get Mumm changed how our office eats! We order every Tuesday and the whole team loves the variety.', 'غيّر Get Mumm طريقة أكل مكتبنا! نطلب كل ثلاثاء ويعشق الفريق التنوع.', 5, '/chef1.png', 'Office Manager at TechCairo', 'مدير مكتب في تك كايرو'),
  ('Layla Mostafa', 'ليلى مصطفى', 'As a working mother, I rely on Get Mumm for healthy family dinners. The food tastes exactly like home cooking!', 'كأم عاملة، أعتمد على Get Mumm لعشاء عائلي صحي. الطعام بالضبط كالطبخ المنزلي!', 5, '/chef2.png', 'Mother of 3, Maadi', 'أم لثلاثة أطفال، المعادي'),
  ('Omar Sherif', 'عمر شريف', 'The Om Ali is honestly better than any restaurant. Fresh, genuine, and delivered hot. 10/10 every time.', 'أم علي بصراحة أفضل من أي مطعم. طازج وحقيقي ويصل ساخنًا. 10/10 في كل مرة.', 5, '/chef1.png', 'Food Blogger', 'مدوّن طعام')
ON CONFLICT DO NOTHING;
`);
console.log("✓ Testimonials");

sql(`
INSERT INTO blog_posts (title, title_ar, slug, excerpt, excerpt_ar, content, content_ar, author, author_ar, image_url, read_time_minutes, type, tags, published_at)
VALUES
  ('The History of Koshari', 'تاريخ الكشري', 'history-of-koshari', 'From humble street food to national icon.', 'من أكلة شعبية متواضعة إلى أيقونة وطنية.', '<p>Koshari is more than just a dish — it is a symbol of Egyptian culture and ingenuity.</p>', '<p>الكشري أكثر من مجرد طبق — إنه رمز للثقافة المصرية.</p>', 'Nadia Hassan', 'نادية حسن', '/koshari.png', 5, 'blog', ARRAY['koshari','history','egyptian-food'], NOW() - INTERVAL '7 days'),
  ('Classic Molokhia Recipe', 'وصفة الملوخية الكلاسيكية', 'classic-molokhia-recipe', 'Learn the secrets to making the perfect molokhia.', 'تعلم أسرار صنع الملوخية المثالية.', '<p>The secret lies in the taaleya — a sizzling mix of garlic and coriander poured at the last moment.</p>', '<p>السر في التعليه — خليط الثوم والكزبرة الساخن الذي يسكب في اللحظة الأخيرة.</p>', 'Nadia Hassan', 'نادية حسن', '/molokhia.png', 7, 'recipe', ARRAY['molokhia','recipe','chicken'], NOW() - INTERVAL '3 days'),
  ('Om Ali: A Love Story', 'أم علي: قصة حب', 'om-ali-love-story', 'The legend behind Egypt''s most beloved dessert.', 'الأسطورة وراء أكثر حلوى مصرية محبوبة.', '<p>Om Ali is Egypt''s answer to bread pudding — layers of pastry soaked in warm sweetened milk, baked until golden.</p>', '<p>أم علي هي الإجابة المصرية على بودينج الخبز.</p>', 'Samira El-Masry', 'سميرة المصري', '/umm_ali.png', 4, 'blog', ARRAY['om-ali','dessert','history'], NOW() - INTERVAL '1 days')
ON CONFLICT (slug) DO NOTHING;
`);
console.log("✓ Blog posts");

sql(`
INSERT INTO subscription_plans (name, name_ar, description, description_ar, price, period, target_audience, features, features_ar, is_popular)
VALUES
  ('Individual', 'فردي', 'Perfect for one person who wants healthy homemade meals daily.', 'مثالي لشخص واحد يريد وجبات منزلية صحية يوميًا.', 420, 'monthly', 'individual', ARRAY['5 meals per week','Choose your dishes','Free delivery','Flexible schedule'], ARRAY['5 وجبات في الأسبوع','اختر أطباقك','توصيل مجاني','جدول مرن'], false),
  ('Family', 'عائلي', 'Feeds a family of 4 with variety and love every week.', 'يُطعم عائلة من 4 أفراد بتنوع وحب كل أسبوع.', 1200, 'monthly', 'family', ARRAY['15 meals per week','Family-sized portions','Free delivery','Weekly menu planning','Priority support'], ARRAY['15 وجبة في الأسبوع','حصص عائلية','توصيل مجاني','تخطيط القائمة الأسبوعية','دعم أولوية'], true),
  ('Office', 'مؤسسي', 'Daily catering for teams of 10-50 people, delivered fresh.', 'تقديم طعام يومي للفرق من 10 إلى 50 شخصًا.', 6500, 'monthly', 'office', ARRAY['Custom team size','Dedicated account manager','Invoicing & reports','Free delivery','Nutritional info'], ARRAY['حجم فريق مخصص','مدير حساب مخصص','فواتير وتقارير','توصيل مجاني','معلومات غذائية'], false)
ON CONFLICT DO NOTHING;
`);
console.log("✓ Subscription plans");

sql(`
UPDATE categories c
SET item_count = (
  SELECT COUNT(*) FROM menu_items m WHERE m.category_id = c.id AND m.is_available = true
);
`);
console.log("✓ Category counts updated");

console.log("✅ Database seeded successfully!");
