-- ============================================================
-- Get Mumm – Seed data
-- Apply this file in the Supabase SQL editor to populate sample data
-- This script clears existing rows and inserts categories, chefs,
-- menu items and testimonials. It updates item counts afterwards.
-- ============================================================

BEGIN;

-- Clear existing data (order chosen to avoid FK issues)
DELETE FROM menu_items;
DELETE FROM testimonials;
DELETE FROM chefs;
DELETE FROM categories;

-- Categories
INSERT INTO categories (name, name_ar, slug, description, description_ar, image_url, item_count)
VALUES
  ('Rice & Grain Dishes','أطباق الأرز والحبوب','rice-grains','Egypt''s beloved rice and grain staples — from street-side koshari to hearty ful medames and flaky fiteer.','أشهر أطباق الأرز والحبوب المصرية — من كشري الشارع إلى الفول المدمس والفطير المشلتت.','/koshari.png',0),
  ('Stuffed Dishes','محاشي','stuffed','Tender vegetables and vine leaves lovingly stuffed with herbed rice, slow-cooked to perfection.','خضروات وأوراق عنب محشوة بأرز معطر، مطبوخة على نار هادئة بعناية.','/mahshi.png',0),
  ('Meat Dishes','أطباق اللحوم','meat','Rich braised meats, festive fattah, and hand-rolled kofta grilled over charcoal.','لحوم مشوية فاخرة وفتة الأعياد وكفتة محضّرة باليد على الفحم.','/kofta.png',0),
  ('Soups & Stews','شوربات وطواجن','soups-stews','Soul-warming molokhia, hearty lentil soup, and slow-simmered tagines.','ملوخية دافئة للروح وشوربة عدس غنية وطواجن تُطهى على نار هادئة.','/molokhia.png',0),
  ('Salads & Sides','سلطات ومقبلات','salads-sides','Fresh garden salads, creamy tahini, smoky baba ghanoush, and seasonal mezze.','سلطات طازجة وطحينة كريمية وبابا غنوج مدخن ومزة موسمية.','/mahshi.png',0),
  ('Desserts','حلويات','desserts','Egypt''s most beloved sweets — from warm umm ali to golden basbousa drizzled with honey.','أشهر الحلويات المصرية — من أم علي الدافئة إلى البسبوسة الذهبية بالعسل.','/umm_ali.png',0)
;

-- Chefs
INSERT INTO chefs (name, name_ar, bio, bio_ar, image_url, specialties, specialties_ar, item_count, rating, joined_year)
VALUES
  ('Umm Hassan','أم حسن','A Cairo kitchen legend with 30 years perfecting street classics. Her koshari is the standard every vendor is measured against — three lentil layers, hand-fried onions, and a sauce made fresh every morning.','أسطورة مطبخ القاهرة بخبرة 30 عاماً في إتقان أكلات الشارع. كشريها هو المقياس الذي يُقاس به كل الباعة — ثلاث طبقات من العدس وبصل مقلي باليد وصلصة طازجة كل صباح.','/chef1.png',ARRAY['Koshari','Ful Medames','Fiteer']::text[],ARRAY['كشري','فول مدمس','فطير']::text[],0,4.9,2016),
  ('Nadia Magdi','نادية مجدي','Nadia inherited her grandmother''s mahshi recipes from Alexandria and has spent two decades perfecting every stuffed leaf and vegetable. She rolls each vine leaf by hand — no machine, no shortcuts.','نادية ورثت وصفات جدتها في المحاشي من الإسكندرية وأمضت عقدين في إتقان كل ورقة وخضرة محشوة. تلف كل ورقة عنب باليد — بدون آلة ولا اختصارات.','/chef2.png',ARRAY['Mahshi','Wara Einab','Stuffed Peppers']::text[],ARRAY['محشي','ورق عنب','فلفل محشي']::text[],0,4.8,2017),
  ('Samia Farouk','سامية فاروق','Samia''s Eid fattah became so famous her neighbours started ordering weeks in advance. Her kofta has a secret blend of seven spices, and her hawawshi is baked in a traditional clay oven for the authentic crunch.','فتة سامية في العيد أصبحت شهيرة لدرجة أن جيرانها بدأوا يطلبون قبل أسابيع. كفتتها لها مزيج سري من سبع بهارات وهواوشيها مخبوز في فرن فخاري تقليدي للحصول على القرمشة الأصيلة.','/chef1.png',ARRAY['Fattah','Kofta','Hawawshi']::text[],ARRAY['فتة','كفتة','هواوشي']::text[],0,4.9,2015),
  ('Hanan Ibrahim','حنان إبراهيم','Hanan''s slow-cooked molokhia with rabbit is a Sunday institution in Giza. Her lentil soup is made with red lentils from Luxor and her chicken tagine simmers for three hours in a sealed clay pot.','ملوخية حنان المطبوخة ببطء مع الأرانب هي طقس يوم الأحد في الجيزة. شوربة عدسها من العدس الأحمر من الأقصر وطاجن دجاجها يُطهى لثلاث ساعات في طاجن فخاري مختوم.','/chef2.png',ARRAY['Molokhia','Lentil Soup','Chicken Tagine']::text[],ARRAY['ملوخية','شوربة عدس','طاجن دجاج']::text[],0,4.7,2018),
  ('Maha El-Sayed','مها السيد','The undisputed queen of Egyptian desserts. Maha''s umm ali is served warm with just the right balance of cream, pastry and toasted nuts. Her konafa is hand-pulled each morning and her basbousa is soaked in rose-water syrup for 24 hours.','الملكة غير المنازعة للحلويات المصرية. أم علي مها تُقدَّم دافئة بالتوازن الصحيح من الكريمة والعجينة والمكسرات. كنافتها تُسحب باليد كل صباح وبسبوسها تنقع في قطر ماء الورد لـ 24 ساعة.','/chef1.png',ARRAY['Umm Ali','Basbousa','Konafa']::text[],ARRAY['أم علي','بسبوسة','كنافة']::text[],0,4.9,2019)
;

-- Menu items
INSERT INTO menu_items (name, name_ar, description, description_ar, price, category_id, category_name, category_name_ar, image_url, dietary, is_available, is_featured, chef_name, chef_name_ar, rating, prep_time_minutes)
VALUES
  ('Koshari','كُشري','Egypt''s iconic street dish — layers of rice, brown lentils, macaroni, crispy fried onions, tangy tomato sauce and a garlic-vinegar daqqa, all in one bowl.','أشهر أكلة شعبية مصرية — طبقات من الأرز والعدس البني والمعكرونة والبصل المقلي المقرمش مع صلصة طماطم حامضة ودقة ثوم وخل في طبق واحد.',65,(SELECT id FROM categories WHERE slug='rice-grains'),'Rice & Grain Dishes','أطباق الأرز والحبوب','/koshari.png',ARRAY['vegan']::text[],true,true,'Umm Hassan','أم حسن',4.9,30),
  ('Ful Medames','فول مدمس','Slow-simmered fava beans with garlic, cumin, lemon and a generous drizzle of extra-virgin olive oil. Egypt''s breakfast staple, made the old way — overnight in a copper pot.','فول مدمس مطبوخ ببطء مع الثوم والكمون والليمون ورذاذ سخي من زيت الزيتون. وجبة الإفطار المصرية الأصيلة بالطريقة القديمة — طوال الليل في وعاء نحاسي.',45,(SELECT id FROM categories WHERE slug='rice-grains'),'Rice & Grain Dishes','أطباق الأرز والحبوب','/koshari.png',ARRAY['vegan','gluten-free']::text[],true,false,'Umm Hassan','أم حسن',4.8,45),
  ('Fiteer Meshaltet','فطير مشلتت','Layers upon layers of paper-thin dough folded with pure butter and baked until flaky and golden — Egypt''s ancient flatbread, served with honey and thick cream.','طبقات فوق طبقات من العجينة الرقيقة مطوية بالسمن الخالص ومخبوزة حتى تصبح ذهبية ومقرمشة — الفطير المصري القديم، يُقدَّم مع العسل والقشطة.',80,(SELECT id FROM categories WHERE slug='rice-grains'),'Rice & Grain Dishes','أطباق الأرز والحبوب','/koshari.png',ARRAY[]::text[],true,false,'Umm Hassan','أم حسن',4.8,50),
  ('Macarona Béchamel','مكرونة بشاميل','Layered pasta baked with spiced minced beef and a thick, golden béchamel crust — Egypt''s beloved answer to lasagne, baked in a deep tray and cut in generous squares.','مكرونة متعددة الطبقات مخبوزة مع لحم بقر مفروم متبل وبشاميل ذهبي سميك — الإجابة المصرية على اللازانيا، مخبوزة في صينية عميقة ومقطعة مربعات سخية.',110,(SELECT id FROM categories WHERE slug='rice-grains'),'Rice & Grain Dishes','أطباق الأرز والحبوب','/fatta.png',ARRAY[]::text[],true,false,'Umm Hassan','أم حسن',4.7,60),

  ('Stuffed Vine Leaves','ورق عنب','Rolled vine leaves packed with herbed rice, diced tomato and a hint of lemon, slow-cooked in a pot lined with lamb ribs for a deep, rich flavour.','أوراق عنب مفرودة محشوة بأرز معطر وطماطم مفرومة ورائحة الليمون، مطبوخة ببطء في طنجرة مبطنة بضلوع خروف لنكهة غنية وعميقة.',140,(SELECT id FROM categories WHERE slug='stuffed'),'Stuffed Dishes','محاشي','/mahshi.png',ARRAY['vegan']::text[],true,true,'Nadia Magdi','نادية مجدي',4.9,90),
  ('Mixed Mahshi Platter','طبق محاشي مشكل','Zucchini, Nile cabbage, peppers and aubergine all stuffed with Nadia''s signature herbed rice — a celebration platter that feeds the whole table.','كوسة وكرنب نيلي وفلفل وباذنجان محشو بأرز نادية المميز — طبق احتفالي يكفي الطاولة كلها.',165,(SELECT id FROM categories WHERE slug='stuffed'),'Stuffed Dishes','محاشي','/mahshi.png',ARRAY['vegan']::text[],true,false,'Nadia Magdi','نادية مجدي',4.8,100),

  ('Lamb Fattah','فتة لحم ضأن','Crispy baladi bread, fragrant white rice and slow-braised whole lamb bathed in a rich garlic-vinegar broth, finished with toasted almonds and pine nuts.','خبز بلدي مقرمش وأرز أبيض فاخر وخروف كامل مسلوق ببطء في مرق غني بالثوم والخل، منتهي باللوز وحبوب الصنوبر المحمصة.',235,(SELECT id FROM categories WHERE slug='meat'),'Meat Dishes','أطباق اللحوم','/fatta.png',ARRAY[]::text[],true,true,'Samia Farouk','سامية فاروق',4.9,120),
  ('Grilled Kofta','كفتة مشوية','Hand-rolled ground beef and lamb kofta seasoned with Samia''s seven-spice blend — parsley, onion, cumin, coriander, cinnamon, allspice and a pinch of chilli — charcoal-grilled and served with tahini.','كفتة لحم بقر وضأن مفرود باليد، متبلة بمزيج سامية السري من سبع بهارات — بقدونس وبصل وكمون وكسبرة وقرفة وبهار وقليل من الفلفل الحار — مشوية على الفحم وتُقدَّم مع الطحينة.',155,(SELECT id FROM categories WHERE slug='meat'),'Meat Dishes','أطباق اللحوم','/kofta.png',ARRAY['gluten-free']::text[],true,true,'Samia Farouk','سامية فاروق',4.8,40),
  ('Hawawshi','هواوشي','Minced beef and lamb heavily spiced with onion, chilli and fresh herbs, sealed inside baladi dough and baked in a clay oven until the outside is shatteringly crisp.','لحم بقر وضأن مفروم متبل بكثافة بالبصل والفلفل والأعشاب الطازجة، مختوم داخل عجينة بلدي ومخبوز في فرن فخاري حتى تصبح الخارجية مقرمشة تماماً.',95,(SELECT id FROM categories WHERE slug='meat'),'Meat Dishes','أطباق اللحوم','/kofta.png',ARRAY[]::text[],true,false,'Samia Farouk','سامية فاروق',4.7,35),

  ('Molokhia with Chicken','ملوخية بالدجاج','Silky jute leaves simmered low and slow in a rich free-range chicken broth, finished with a sizzling ta''leya of garlic and dried coriander poured tableside.','أوراق ملوخية ناعمة تُطهى ببطء في مرق دجاج بلدي غني، منتهية بتقلية مقلية من الثوم والكسبرة المجففة تُسكب على الطاولة.',130,(SELECT id FROM categories WHERE slug='soups-stews'),'Soups & Stews','شوربات وطواجن','/molokhia.png',ARRAY['gluten-free']::text[],true,false,'Hanan Ibrahim','حنان إبراهيم',4.8,50),
  ('Shorbet Ads','شوربة عدس','Velvety red lentil soup made with Luxor lentils, roasted cumin, fresh lemon and topped with a swirl of crispy golden fried onions and a drizzle of chilli oil.','شوربة عدس أحمر مخملية من عدس الأقصر مع كمون محمص وليمون طازج ومزينة بحلقات بصل مقلية ذهبية ورذاذ زيت الفلفل الحار.',75,(SELECT id FROM categories WHERE slug='soups-stews'),'Soups & Stews','شوربات وطواجن','/molokhia.png',ARRAY['vegan','gluten-free']::text[],true,false,'Hanan Ibrahim','حنان إبراهيم',4.7,35),
  ('Chicken Tagine','طاجن دجاج','Free-range chicken, seasonal vegetables and preserved lemon sealed inside a clay tagine with saffron, then slow-cooked for three hours until the meat falls from the bone.','دجاج بلدي وخضار موسمية وليمون مخلل مختومة داخل طاجن فخاري مع زعفران، ثم تُطهى ببطء لثلاث ساعات حتى تتساقط اللحمة من العظمة.',175,(SELECT id FROM categories WHERE slug='soups-stews'),'Soups & Stews','شوربات وطواجن','/molokhia.png',ARRAY['gluten-free']::text[],true,false,'Hanan Ibrahim','حنان إبراهيم',4.8,80),

  ('Salata Baladi','سلطة بلدي','Classic Egyptian village salad of vine-ripened tomatoes, cucumber, red onion and flat-leaf parsley in a sharp lemon and extra-virgin olive oil dressing.','السلطة البلدية الكلاسيكية من طماطم ناضجة على الكرمة وخيار وبصل أحمر وبقدونس مع تتبيلة حامضة من الليمون وزيت الزيتون البكر.',55,(SELECT id FROM categories WHERE slug='salads-sides'),'Salads & Sides','سلطات ومقبلات','/mahshi.png',ARRAY['vegan','gluten-free']::text[],true,false,'Umm Hassan','أم حسن',4.6,10),
  ('Tahini & Baba Ghanoush','طحينة وبابا غنوج','Freshly stone-ground sesame tahini alongside flame-roasted aubergine mashed with garlic, lemon and smoked paprika — served with warm baladi bread for dipping.','طحينة سمسم مطحونة حجراً طازجة مع متبل باذنجان محمص على النار ومهروس بالثوم والليمون والبابريكا المدخنة — تُقدَّم مع خبز بلدي دافئ.',70,(SELECT id FROM categories WHERE slug='salads-sides'),'Salads & Sides','سلطات ومقبلات','/mahshi.png',ARRAY['vegan']::text[],true,false,'Samia Farouk','سامية فاروق',4.7,15),

  ('Umm Ali','أم علي','Egypt''s most beloved dessert — torn puff pastry soaked in sweetened cream, scattered with toasted almonds, hazelnuts, coconut and raisins, then baked until bubbling and golden.','أشهر حلوى مصرية — عجينة منفوخة مقطعة منقوعة في كريمة محلاة مع لوز وبندق وجوز هند وزبيب محمص، ثم مخبوزة حتى تفور وتصبح ذهبية.',85,(SELECT id FROM categories WHERE slug='desserts'),'Desserts','حلويات','/umm_ali.png',ARRAY[]::text[],true,true,'Maha El-Sayed','مها السيد',4.9,25),
  ('Basbousa bil Ashta','بسبوسة بالقشطة','Golden semolina cake soaked in rose-water syrup for 24 hours, topped with thick clotted ashta cream and crushed pistachios — Maha''s signature after-Ramadan dessert.','كيكة سميد ذهبية منقوعة في قطر ماء الورد لـ 24 ساعة، مزينة بالقشطة الكثيفة والفستق المطحون — حلوى مها المميزة بعد رمضان.',75,(SELECT id FROM categories WHERE slug='desserts'),'Desserts','حلويات','/umm_ali.png',ARRAY[]::text[],true,false,'Maha El-Sayed','مها السيد',4.8,20),
  ('Konafa bil Goz el-Hend','كنافة بجوز الهند','Hand-pulled shredded filo pastry filled with sweet cream cheese and toasted coconut, baked until deep golden, then flooded with orange-blossom honey syrup.','عجينة كنافة مسحوبة باليد محشوة بجبنة قشطة حلوة وجوز هند محمص، مخبوزة حتى تصبح ذهبية عميقة ثم تُغرق بقطر عسل زهر البرتقال.',95,(SELECT id FROM categories WHERE slug='desserts'),'Desserts','حلويات','/umm_ali.png',ARRAY[]::text[],true,false,'Maha El-Sayed','مها السيد',4.9,30)
  ,
  ('Kofta Sandwich','كفتة ساندويتش','Grilled kofta tucked into warm baladi bread with tahini and pickles.','كفتة مشوية محشوة في خبز بلدي مع طحينة ومخللات.',75,(SELECT id FROM categories WHERE slug='meat'),'Meat Dishes','أطباق اللحوم','/kofta.png',ARRAY[]::text[],true,false,'Samia Farouk','سامية فاروق',4.5,20)
  ,
  ('Bamya Stew','طاجن بامية','Slow-cooked okra in a rich tomato and lamb broth, served with fragrant rice.','بامية مطهوة ببطء في مرق طماطم ولحم غني وتُقدَّم مع أرز معطر.',120,(SELECT id FROM categories WHERE slug='soups-stews'),'Soups & Stews','شوربات وطواجن','/molokhia.png',ARRAY['gluten-free']::text[],true,false,'Hanan Ibrahim','حنان إبراهيم',4.6,90)
  ,
  ('Foul & Taameya Plate','طبق فول وطعمية','Traditional foul medames served with crispy taameya, fresh salad and baladi bread.','طبق فول مدمس تقليدي مع طعمية مقرمشة وسلطة طازجة وخبز بلدي.',55,(SELECT id FROM categories WHERE slug='rice-grains'),'Rice & Grain Dishes','أطباق الأرز والحبوب','/koshari.png',ARRAY['vegan']::text[],true,false,'Umm Hassan','أم حسن',4.4,25)
  ,
  ('Stuffed Eggplant','محشى باذنجان','Eggplant stuffed with herbed rice, tomatoes and a touch of lamb, slow-baked to meld flavours.','باذنجان محشو بالأرز المعطر والطماطم وقليل من اللحم، مخبوز ببطء لاندماج النكهات.',155,(SELECT id FROM categories WHERE slug='stuffed'),'Stuffed Dishes','محاشي','/mahshi.png',ARRAY[]::text[],true,false,'Nadia Magdi','نادية مجدي',4.7,90)
;

-- Update item counts for chefs and categories
UPDATE chefs SET item_count = (
  SELECT COUNT(*) FROM menu_items WHERE menu_items.chef_name = chefs.name
);

UPDATE categories SET item_count = (
  SELECT COUNT(*) FROM menu_items WHERE menu_items.category_id = categories.id
);

-- Testimonials
INSERT INTO testimonials (name, name_ar, quote, quote_ar, type, rating, avatar_url, company, company_ar, role, role_ar)
VALUES
  ('Layla Hassan','ليلى حسن','Umm Hassan''s koshari brought back memories of eating on the street in Sayeda Zeinab. Three lentil layers, crispy onions, the sauce just right. I''ve ordered every week for four months now.','كشري أم حسن أعاد لي ذكريات الأكل في شارع السيدة زينب. ثلاث طبقات عدس وبصل مقلي والصلصة صح تماماً. طلبت كل أسبوع منذ أربعة أشهر.','customer',5,'/koshari.png',NULL,NULL,NULL,NULL),
  ('Ahmed Kamal','أحمد كمال','Nadia''s mixed mahshi platter — my entire family argued over who got the last stuffed pepper. That is the highest compliment I know how to give.','طبق محاشي نادية المشكل — تجادلت عائلتي بأكملها على آخر فلفلة محشية. هذا أعلى مديح أعرفه.','customer',5,'/mahshi.png',NULL,NULL,NULL,NULL),
  ('Dina Samir','دينا سمير','Samia''s lamb fattah for Eid was exactly what I grew up eating at my grandmother''s — crispy bread soaked in that garlic broth. I cried a little, honestly.','فتة لحم الضأن من سامية في العيد كانت بالضبط ما كبرت عليه في بيت جدتي — خبز مقرمش منقوع في مرق الثوم. بكيت قليلاً بصراحة.','customer',5,'/fatta.png',NULL,NULL,NULL,NULL),
  ('Sara Mostafa','سارة مصطفى','Maha''s umm ali arrived warm, perfectly creamy, with toasted nuts in every spoonful. I closed my eyes and I was back in my mother''s kitchen. Five stars isn''t enough.','أم علي مها وصلت دافئة وكريمية بشكل مثالي مع مكسرات محمصة في كل ملعقة. أغمضت عيني وعدت إلى مطبخ أمي. خمس نجوم لا تكفي.','customer',5,'/umm_ali.png',NULL,NULL,NULL,NULL),
  ('Khaled Mansour','خالد منصور','Hanan''s molokhia with chicken is the real thing — that ta''leya poured at the table, the smell that fills the room. My kids have started requesting it every Sunday like clockwork.','ملوخية حنان بالدجاج هي الشيء الحقيقي — التقلية تُسكب على الطاولة والرائحة تملأ الغرفة. أولادي بدأوا يطلبونها كل أحد مثل الساعة.','customer',5,'/molokhia.png',NULL,NULL,NULL,NULL),
  ('Omar Fathy','عمر فتحي','Our team of 40 orders lunch from Get Mumm three times a week. Always on time, always hot, and every single person finishes their plate. That never happened with any other catering.','فريقنا المكون من 40 شخصاً يطلب الغداء من Get Mumm ثلاث مرات أسبوعياً. دائماً في الوقت وساخن دائماً وكل شخص ينهي طبقه. هذا لم يحدث مع أي تقديم طعام آخر.','office',5,'/office_catering.png','Nile Digital Agency','وكالة نايل ديجيتال','Operations Manager','مدير العمليات'),
  ('Rania El-Desoky','رانيا الدسوقي','We tried five catering companies before Get Mumm. We are the only office where people ask for the chef''s name after lunch. Samia''s kofta is what converted us.','جربنا خمس شركات تقديم طعام قبل Get Mumm. نحن المكتب الوحيد الذي يسأل فيه الناس عن اسم الطاهية بعد الغداء. كفتة سامية هي ما حوّلنا.','office',5,'/office_catering.png','Maadi Architecture Studio','استوديو معادي للعمارة','Founder','المؤسسة'),
  ('Yasmin Nour','ياسمين نور','I ordered Nadia''s vine leaves for a dinner party of twelve. Every guest asked me which restaurant I used. When I said it was a home cook, no one believed me.','طلبت ورق عنب نادية لعشاء من اثني عشر شخصاً. كل ضيف سألني أي مطعم استخدمت. حين قلت إنها طاهية منزلية، لم يصدق أحد.','customer',5,'/mahshi.png',NULL,NULL,NULL,NULL)
;

-- Blog posts
-- Remove any existing blog posts that match these seed slugs to avoid duplicates
DELETE FROM blog_posts WHERE slug IN ('how-to-make-koshari','magic-of-molokhia','5-tips-office-catering','behind-chef-nadia','seasonal-summer-salads');

INSERT INTO blog_posts (title, title_ar, slug, excerpt, excerpt_ar, content, content_ar, image_url, published_at, author, author_ar, tags)
VALUES
  ('How to Make the Perfect Koshari','كيف تصنع الكشري المثالي','how-to-make-koshari','A step-by-step guide to layering rice, lentils and macaroni for the perfect koshari.','دليل خطوة بخطوة لترتيب الأرز والعدس والمعكرونة لصنع كشري مثالي.','Full content about making koshari...','محتوى كامل عن كيفية صنع الكشري...', '/koshari.png', now()::text, 'Get Mumm Team','فريق Get Mumm', ARRAY['koshari','street-food']::text[]),
  ('The Magic of Molokhia','سحر الملوخية','magic-of-molokhia','Why molokhia is a comfort food staple and how to serve it with chicken or rabbit.','لماذا الملوخية طعام مريح وكيف تقدم مع الدجاج أو الأرانب.','Full content about molokhia...','محتوى كامل عن الملوخية...', '/molokhia.png', now()::text, 'Hanan Ibrahim','حنان إبراهيم', ARRAY['molokhia','soups']::text[])
  ,
  ('5 Tips for Office Catering','5 نصائح لتقديم الطعام للمكاتب','5-tips-office-catering','How to plan office catering for large teams and keep everyone happy.','كيفية تخطيط تقديم الطعام للمكاتب الكبيرة وإسعاد الجميع.','Full content about office catering...','محتوى كامل عن تقديم الطعام للمكاتب...', '/office_catering.png', now()::text, 'Get Mumm Team','فريق Get Mumm', ARRAY['office','catering']::text[])
  ,
  ('Behind Chef Nadia''s Mahshi','خلف وصفة محشي نادية','behind-chef-nadia','A profile on Nadia Magdi and her mahshi techniques passed down through generations.','ملف عن نادية مجدي وتقنيات المحشي التي ورثتها عبر الأجيال.','Full content about Nadia...','محتوى كامل عن نادية...', '/mahshi.png', now()::text, 'Nadia Magdi','نادية مجدي', ARRAY['mahshi','chefs']::text[])
  ,
  ('Seasonal Summer Salads','سلطات صيفية موسمية','seasonal-summer-salads','Light salads and sides perfect for hot weather using seasonal produce.','سلطات ومقبلات خفيفة مثالية لطقس حار باستخدام منتجات موسمية.','Full content about summer salads...','محتوى كامل عن السلطات الصيفية...', '/mahshi.png', now()::text, 'Get Mumm Team','فريق Get Mumm', ARRAY['salads','seasonal']::text[])
;

-- Subscription plans
INSERT INTO subscription_plans (name, name_ar, description, description_ar, price, period, features, features_ar, is_popular, target_audience)
VALUES
  ('Monthly Individual','شهري فردي','Access to an individual monthly plan with 2 lunches per week.','وصول لخطة شهرية فردية مع وجبتين في الأسبوع.',49.99,'monthly', ARRAY['2 lunches / week','Priority support']::text[], ARRAY['وجبتان في الأسبوع','دعم أولوية']::text[], false, 'individual'),
  ('Office Team','فريق مكاتب','Tailored office catering with flexible head-count and delivery windows.','خدمة تقديم طعام مكتبية مخصصة مع عدد أشخاص وتوقيتات توصيل مرنة.',499.0,'monthly', ARRAY['Flexible head count','Weekly delivery windows','Dedicated account manager']::text[], ARRAY['عدد أشخاص مرن','مواعيد توصيل أسبوعية','مدير حساب مخصص']::text[], true, 'office')
;

-- Contacts (sample)
INSERT INTO contacts (name, email, phone, message, subject)
VALUES
  ('Test User','test@example.com','+201001234567','I have a question about catering options.','Catering question');

-- Office inquiries (sample)
INSERT INTO office_inquiries (company_name, contact_name, email, phone, head_count, delivery_area, frequency, message)
VALUES
  ('Nile Digital Agency','Omar Fathy','omar@nil.com','+201009876543',40,'Maadi','weekly','Looking for weekly team lunches for 40 people.');

COMMIT;

-- Done.
