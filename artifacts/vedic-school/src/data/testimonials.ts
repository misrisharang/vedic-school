export interface Testimonial {
  name: string;
  relation?: string;
  location?: string;
  quote: string;
  /** Short cut of the parent's own words, for compact cards. Never reworded. */
  excerpt?: string;
}

// Attributions follow the original thevedicschool.co.in testimonials and the
// public Google Business reviews. The person named is the parent who wrote it.
export const testimonials: Testimonial[] = [
  {
    name: "Miti Jindal",
    relation: "Mother of Marc",
    location: "Australia",
    quote:
      "We were given Meenakshi's reference from our family member whose 2 kids were getting taught by her. Me and my husband decided to try her for our then 6 year old son Marc who was always fascinated by maths. Once we started the coaching, Meenakshi's way of handling the questions he was asking and the style of her teaching was very impressive. My son has come a long way with her.",
    excerpt:
      "Meenakshi's way of handling the questions he was asking and the style of her teaching was very impressive. My son has come a long way with her.",
  },
  {
    name: "Priyanka Bankeraika",
    relation: "Mother of Bhavya and Mansha",
    location: "London, UK",
    quote:
      "I would like to express my heartfelt gratitude for the wonderful Vedic Maths classes taught to my children, Bhavya and Mansha. Both of them have greatly benefited from the sessions. The techniques and tricks they learned for fast calculations have been incredibly useful, especially in helping them solve problems more efficiently during their Olympiad exams. Thank you for making mathematics a fun and engaging subject for them.",
    excerpt:
      "The techniques and tricks they learned for fast calculations have been incredibly useful, especially in helping them solve problems more efficiently during their Olympiad exams.",
  },
  {
    name: "Simmi Gupta",
    relation: "Google review",
    quote:
      "Meenakshi is an outstanding teacher. My 7 year old is going to her since 2 years. She is very loving as a teacher and guides kids as per their requirements, and not by a stated protocol. My son scored amazing rank in maths olympiad under her guidance. He is very clear with the concept and always wants to go to her class.",
    excerpt:
      "She is very loving as a teacher and guides kids as per their requirements, and not by a stated protocol. My son scored amazing rank in maths olympiad under her guidance.",
  },
  {
    name: "Neha Bhandari",
    location: "Indore, India",
    quote:
      "Earlier I was quite apprehensive to decide whether I should confuse my child with a very different approach to learn maths. But Meenakshi changed my apprehension completely. It had a cascading effect on my daughter. Not only that fear was gone but she started enjoying numbers. Her concepts became more strong. She gained confidence. Meenakshi made the whole journey fun and interesting.",
    excerpt:
      "Not only that fear was gone but she started enjoying numbers. Her concepts became more strong. She gained confidence.",
  },
  {
    name: "Snehal Sachin Harane",
    relation: "Mother of Anivesh",
    quote:
      "My son took admission in the month of January and he was least interested in maths, I was so worried about this. But within 2 months, owing to Meenakshi mam's teaching techniques and her efforts, my son started to like maths. Thank you so much for your dedication",
    excerpt:
      "He was least interested in maths, I was so worried about this. But within 2 months, owing to Meenakshi mam's teaching techniques and her efforts, my son started to like maths.",
  },
  {
    name: "Radhika Jaykar",
    relation: "Mother of Aryan",
    quote:
      "I highly recommend Meenakshi for maths tuition. My son has been taking online classes with her from last year. She is very dedicated to her job. You can connect with her any time and she is always ready to clear ur doubts. She has a very friendly way of teaching and very very detailed explanation also.",
    excerpt:
      "My son has been taking online classes with her from last year. She has a very friendly way of teaching and very very detailed explanation also.",
  },
  {
    name: "Parent of Dhairya Pawalia",
    location: "Indore, India",
    quote:
      "Online Vedic from The Vedic School classes is most helpful & most practical, my son has improved dramatically over in months. She knows her subject, how to teach & cares about the success of her students. Now my Son understands Maths in a whole new way, he learnt the logic & beauty of Maths- not just memorizing facts, but actually enjoys doing Maths.",
    excerpt:
      "Now my Son understands Maths in a whole new way, he learnt the logic & beauty of Maths- not just memorizing facts, but actually enjoys doing Maths.",
  },
];
