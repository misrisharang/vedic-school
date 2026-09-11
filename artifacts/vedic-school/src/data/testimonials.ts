export interface Testimonial {
  name: string;
  relation?: string;
  location?: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Krishang K Sharma",
    quote:
      "Maths develops our reasoning, analytical thinking and practical understanding, and its use can be applied in everyday life. Meenakshi Mam has been one of my most amazing Maths teachers. Through Vedic Maths, she has helped me develop an interest in Maths and supported me morally and academically. You taught me never to give up and that there is more than one way to solve everything.",
  },
  {
    name: "Miti Jindal",
    relation: "(Mother – Marc Veer Jindal)",
    location: "Australia",
    quote:
      "We were given Meenakshi’s reference by a family member whose two children were being taught by her. We were impressed by their knowledge and understanding, so we decided to try her for our six-year-old son Marc. Her way of handling his questions and her teaching style were very impressive. My son has come a long way with her. Thank you for your continuous support.",
  },
  {
    name: "Nikhil Francine",
    location: "London",
    quote:
      "She is a great teacher, ever so patient and helpful. She always goes the extra mile to make sure that I understand the topic being taught. Her patience and willingness to explain things clearly make learning Maths much easier. She takes the time to make sure I understand before moving forward, which makes her a wonderful teacher.",
  },
];
