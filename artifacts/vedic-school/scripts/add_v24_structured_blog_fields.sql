-- ==============================================================================
-- THE VEDIC SCHOOL — CMS v2.4 STRUCTURED BLOG ARTICLE FIELDS MIGRATION
-- ==============================================================================
-- Purpose:
-- Provisions structured columns in `public.blog_posts` for:
-- 1. `tldr` (jsonb array of strings for dedicated TL;DR bullets)
-- 2. `quick_verdict` (text for key takeaway editorial block)
-- 3. `sources` (jsonb array of objects: { publication, title, url, date? })
-- 4. `featured_image_alt` (text for cover image accessibility & SEO)
--
-- Note:
-- This script is non-destructive, additive, and safe to execute.
-- DO NOT automatically apply to production without explicit confirmation.
-- ==============================================================================

-- 1. ADD NEW STRUCTURED COLUMNS
alter table public.blog_posts 
  add column if not exists tldr jsonb default '[]'::jsonb,
  add column if not exists quick_verdict text,
  add column if not exists sources jsonb default '[]'::jsonb,
  add column if not exists featured_image_alt text;

-- 2. OPTIONAL BACKFILL / SEED SCRIPT FOR EXISTING PUBLISHED ARTICLES
-- This allows populating the structured fields without altering existing body content.

-- 2A. 'vedic-maths-vs-abacus'
update public.blog_posts
set
  tldr = '[
    "Abacus is a bead-based method that becomes a mental abacus. It has the stronger research record for arithmetic speed: children improved over a 3-year trial in India and a 5-year trial in China. A 1-year trial in US schools found no advantage.",
    "Vedic Maths is a set of calculation methods from a 1965 book. It builds flexibility with numbers, but the research on it is small and thin, and historians dispute its link to the Vedas.",
    "Neither has been shown to raise IQ or deliver \"whole-brain development\". The trials found no change in general intelligence.",
    "Age matters. Abacus suits roughly 5 to 8 year olds who can commit for years. Vedic Maths suits children whose times tables and place value are already secure.",
    "On Reddit, the speed of abacus-trained children is the benefit people describe most. Whether it helps with school Maths later is where opinions split.",
    "Struggling at school? Find and rebuild the gap first. Speed built on a shaky foundation doesn''t last."
  ]'::jsonb,
  quick_verdict = 'Neither is better for every child. Abacus trains very fast arithmetic by picturing beads, and it works best when a child starts young (roughly 5 to 8) and sticks with it for years. Vedic Maths teaches flexible calculation methods that pay off once a child already knows their number facts (roughly 8 and up). If your child is struggling with school Maths, neither is the first fix; the missing foundation is. In the interest of full disclosure: I teach Vedic Maths, not abacus, and I''ve tried to be fair to both.',
  featured_image_alt = 'Vedic Maths vs Abacus comparison illustration for parents',
  sources = '[
    {"publication": "Barner, D. et al. (2016)", "title": "Learning mathematics in a visuospatial format: A randomized, controlled trial of mental abacus instruction. Child Development, 87(4)", "url": "https://academic.oup.com/chidev/article/87/4/1146/8258418"},
    {"publication": "British Psychological Society", "title": "Research Digest: Teaching children the ancient \"mental abacus\" technique boosted their maths abilities", "url": "https://www.bps.org.uk/research-digest/teaching-children-ancient-mental-abacus-technique-boosted-their-maths-abilities"},
    {"publication": "Barner, D. et al. (2018)", "title": "A one-year classroom-randomized trial of mental abacus instruction for first- and second-grade students. Journal of Numerical Cognition", "url": "https://jnc.psychopen.eu/index.php/jnc/article/download/5761/5761.html?inline=1"},
    {"publication": "Wang et al. (2019)", "title": "Training on abacus-based mental calculation enhances visuospatial working memory in children. Journal of Neuroscience, 39(33)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6697396/"},
    {"publication": "Dani, S. G.", "title": "Myths and reality: On \"Vedic mathematics\"", "url": "https://lakshminarayanlenasia.com/articles/MythsandRealityVedicMathematics.pdf"},
    {"publication": "Wikipedia", "title": "Vedic Mathematics", "url": "https://en.wikipedia.org/wiki/Vedic_Mathematics"},
    {"publication": "Innovare Journal of Education", "title": "Effectiveness of Vedic Mathematics in Middle School Education: An Experimental Study", "url": "https://journals.innovareacademics.in/index.php/ijoe/article/view/59020"},
    {"publication": "International Journal of Research and Innovation in Social Science", "title": "The Effects of Vedic Mathematics on the Basic Mathematical Skills and Engagement of Grade 7 Students", "url": "https://rsisinternational.org/journals/ijriss/articles/the-effects-of-vedic-mathematics-on-the-basic-mathematical-skills-and-engagement-of-grade-7-students/"},
    {"publication": "Gulf News", "title": "Launch of SIP Abacus in UAE (programme for ages 6 to 12)", "url": "https://gulfnews.com/business/corporate-news/launch-of-sip-abacus-in-uae-empowering-children-worldwide-to-face-future-challenges-with-confidence-1.1686134174124"}
  ]'::jsonb
where slug = 'vedic-maths-vs-abacus';

-- 2B. 'is-vedic-maths-useful'
update public.blog_posts
set
  tldr = '[
    "Vedic Maths is not from the Vedas. It was published in 1965 by Bharati Krishna Tirtha. Historians have found no trace of its sutras in the actual Vedic texts. This is settled, not controversial.",
    "The techniques themselves are valid maths, not pseudoscience. Every result can be checked with ordinary arithmetic, because the methods are built on real algebraic identities.",
    "The \"10x faster\" claims are marketing, not research. The actual studies are small, short, and show modest gains, not transformation.",
    "The real risk is memorising the trick without the reason. A child can get the right answer and still not understand what they did, which shows up the moment the numbers don''t fit the pattern.",
    "On Reddit, the split is almost exactly this: people who were taught it as isolated tricks call it pointless; people taught the reasoning defend it.",
    "My answer: it''s a genuine tool for number sense, not a replacement for understanding, and not a replacement for the school curriculum either."
  ]'::jsonb,
  quick_verdict = 'Yes, Vedic Maths is useful, but only when it''s taught to explain *why* a method works, not just *how* to do it. Taught as a list of tricks to memorise, it''s exactly what the critics say: fast answers with nothing underneath. I teach it the first way. The distinction isn''t marketing, it''s the entire argument, and I''ve tried to make the case against my own subject as honestly as the case for it.',
  featured_image_alt = 'Is Vedic Maths Useful cover illustration showing mathematical patterns',
  sources = '[
    {"publication": "Bhanzu", "title": "Vedic Maths Tricks: Do They Actually Help?", "url": "https://bhanzu.com/math/vedic-math-tricks"},
    {"publication": "Bhanzu", "title": "Vedic Maths: What it is, Sutras, Methods and Benefits Explained", "url": "https://bhanzu.com/math/vedic-maths"},
    {"publication": "Dani, S. G.", "title": "Myths and reality: On \"Vedic mathematics\"", "url": "https://lakshminarayanlenasia.com/articles/MythsandRealityVedicMathematics.pdf"},
    {"publication": "Wikipedia", "title": "Vedic Mathematics", "url": "https://en.wikipedia.org/wiki/Vedic_Mathematics"},
    {"publication": "Innovare Journal of Education", "title": "Effectiveness of Vedic Mathematics in Middle School Education: An Experimental Study", "url": "https://journals.innovareacademics.in/index.php/ijoe/article/view/59020"},
    {"publication": "International Journal of Research and Innovation in Social Science", "title": "The Effects of Vedic Mathematics on the Basic Mathematical Skills and Engagement of Grade 7 Students", "url": "https://rsisinternational.org/journals/ijriss/articles/the-effects-of-vedic-mathematics-on-the-basic-mathematical-skills-and-engagement-of-grade-7-students/"},
    {"publication": "Biyani Group of Colleges", "title": "Vedic Maths – Myth or Science? A Critical Analysis", "url": "https://www.biyanicolleges.org/vedic-maths-myth-or-science-a-critical-analysis/"}
  ]'::jsonb
where slug = 'is-vedic-maths-useful';

-- 2C. 'best-vedic-maths-online-classes-for-kids'
update public.blog_posts
set
  tldr = '[
    "I built The Vedic School for children who need Maths to make sense, not only to go faster: one experienced teacher, every class, with a free Sunday demo before you commit.",
    "For a fully published 1:1 option, AbacusTrainer and Kids Infinite Learning tied for the top score in my comparison (30/30): both publish prices for group and 1:1, offer a free trial and set out clear levels.",
    "Easiest to budget for younger children: ALLEN IntelliBrain publishes per-level prices for Grades 1–2, starting at ₹2,899.",
    "Prices vary widely, from about ₹2,900 for a short group level to ₹15,750 for a 30-class 1:1 package. Bhanzu and PlanetSpark don''t publish prices.",
    "Almost every provider offers a free demo. Use it to check whether the teacher explains why a method works.",
    "On Reddit, the most active threads are refund complaints about Bhanzu, plus scepticism that Vedic Maths is only a set of tricks.",
    "Before you pay, check the class size, the refund policy and whether you must pay for months upfront."
  ]'::jsonb,
  quick_verdict = 'I built The Vedic School to give a child one experienced teacher who checks understanding before chasing speed, not a rotating roster of tutors or a script read off a screen. If that''s what you''re looking for, start with the free Sunday demo. It''s not the only class here that does a job well. If you want a 1:1 option with the price published upfront, AbacusTrainer and Kids Infinite Learning are the strongest of the eight I compared. If you want a short, affordable group course you can budget for in advance, ALLEN IntelliBrain is the easiest. The Vedic School is listed first because it''s mine: I''ve judged the other seven on what they publish rather than what they advertise, and I haven''t scored my own class against them.',
  featured_image_alt = 'Comparison of 8 Vedic Maths Online Classes for Kids in 2026',
  sources = '[
    {"publication": "AbacusTrainer", "title": "Online Vedic Maths Classes", "url": "https://www.abacustrainer.com/online-vedic-maths-classes-for-students"},
    {"publication": "Kids Infinite Learning", "title": "Online Vedic Maths Classes", "url": "https://kidsinfinitelearning.com/course/online-vedic-maths/"},
    {"publication": "Penkraft", "title": "Vedic Maths Level 1", "url": "https://online.penkraft.in/LiveVedicMathsTraining/Level1"},
    {"publication": "Penkraft", "title": "Vedic Maths course", "url": "https://www.penkraft.in/VedicMaths"},
    {"publication": "Penkraft", "title": "Course post on r/vedicmathematics", "url": "https://www.reddit.com/r/vedicmathematics/comments/p0ec5g/penkraft_online_live_vedic_math_course/"},
    {"publication": "Vedantu", "title": "Vedic Maths Online Classes for Kids", "url": "https://www.vedantu.com/kids-learning/vedic-maths-online-classes-for-kids"},
    {"publication": "ALLEN IntelliBrain", "title": "Vedic Maths", "url": "https://www.theintellibrain.com/vedicmaths/"},
    {"publication": "Bhanzu", "title": "Vedic Maths Classes for Kids", "url": "https://bhanzu.com/math/classes/vedic"},
    {"publication": "Brighterly", "title": "Bhanzu Math Cost in 2026 (third-party, updated 25 July 2026)", "url": "https://brighterly.com/blog/bhanzu-math-cost/"},
    {"publication": "PlanetSpark", "title": "Vedic Mathematics Online Classes", "url": "https://www.planetspark.in/maths/vedic-mathematics-online-classes"},
    {"publication": "Vedic Maths Forum India", "title": "Online classes for kids", "url": "https://vedicmathsindia.org/vedic-maths-online-classes-for-kids-and-beginners-in-india/"},
    {"publication": "Winaum Learning", "title": "Vedic Maths Classes", "url": "https://www.winaumlearning.com/vedic-maths-classes/"},
    {"publication": "Outschool", "title": "Vedic Math classes", "url": "https://outschool.com/online-classes/popular/vedic-math"}
  ]'::jsonb
where slug = 'best-vedic-maths-online-classes-for-kids';
