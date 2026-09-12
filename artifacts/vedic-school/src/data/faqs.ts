// ==============================================================================
// THE VEDIC SCHOOL — FAQ CONTENT (SINGLE SOURCE OF TRUTH)
// ==============================================================================
// Used for:
// 1. Visible HTML accordion rendering on pillar pages (/vedic-maths, /curriculum-aligned)
// 2. Future page-specific FAQPage JSON-LD schema generation
//
// NOTE: The homepage does NOT contain an FAQ section and must not receive FAQs.
// ==============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * 5 Pillar FAQs for Vedic Maths Classes (/vedic-maths)
 */
export const VEDIC_MATHS_FAQS: FAQItem[] = [
  {
    question: 'Who is Vedic Maths for?',
    answer:
      'Vedic Maths is for children at different starting points. Whether your child is still building their number foundations, understands the basics but calculates slowly, or already enjoys Maths and wants more challenge, I start with where their thinking is today.',
  },
  {
    question: 'Where does my child start?',
    answer:
      "At the level that's right for them. Some children begin by strengthening foundations. Others are ready to build fluency or move into more advanced work. The starting point is based on how your child currently thinks with numbers — not simply their age or grade.",
  },
  {
    question: 'Does my child need to be good at Maths to start?',
    answer:
      "No. Your child doesn't need to be naturally quick at Maths or already confident with numbers. The important thing is starting from what they understand today and building from there.",
  },
  {
    question: 'Is Vedic Maths just a collection of shortcuts?',
    answer:
      'No. I teach techniques as tools for working with numbers more efficiently, but they are built on understanding rather than replacing it. Understanding comes first. Speed follows.',
  },
  {
    question: 'Will Vedic Maths replace school Maths?',
    answer:
      'No. Vedic Maths builds calculation fluency and confidence. It complements, rather than replaces, the Maths children learn at school. Where your child needs direct help with their school curriculum, I also offer separate curriculum-aligned classes.',
  },
];

/**
 * 5 Pillar FAQs for Curriculum-Aligned Classes (/curriculum-aligned)
 */
export const CURRICULUM_ALIGNED_FAQS: FAQItem[] = [
  {
    question: 'Who are these classes for?',
    answer:
      'For children who understand some Maths but struggle to apply it, have gaps in earlier concepts, find it difficult to keep up with schoolwork, need more individual attention, or want stronger preparation for tests and exams.',
  },
  {
    question: 'Where does my child start?',
    answer:
      'We start with where your child actually is. We look at their current schoolwork and identify whether a gap in an earlier concept is making the current topic difficult. If it is, we work on that foundation before moving forward. The starting point is always their actual level, not simply their grade.',
  },
  {
    question: "Does my child's class follow their school textbook and syllabus?",
    answer:
      'Yes. Classes are built around what your child is actually learning at school, using their current topics and textbook where relevant. The exact content depends on their school and board.',
  },
  {
    question: 'Which boards do you support?',
    answer:
      "I currently work with students following CBSE, ICSE and IB curricula. The exact topics covered depend on the child's school curriculum and learning needs.",
  },
  {
    question: 'Is this a replacement for school Maths?',
    answer:
      'No. These classes complement school by giving your child focused teaching, practice and individual support around the Maths they are already learning.',
  },
];
