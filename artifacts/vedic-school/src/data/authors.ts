// ==============================================================================
// THE VEDIC SCHOOL — CANONICAL AUTHORS REGISTRY (FALLBACK & DEFAULT)
// ==============================================================================

import type { Author } from '@/types/blog';

export const MEENAKSHI_KOUL_AUTHOR: Author = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'Meenakshi Koul',
  slug: 'meenakshi-koul',
  role: 'Founder & Educator, The Vedic School',
  bio: `I've been teaching Mathematics for 20+ years, first in India, and more recently, to students across different time zones.

Over the years, I've realised that teaching Maths is rarely just about explaining the question in front of you. I've learnt to look for the pattern behind the problem.

My work has also been shaped by a deeper interest in how children learn, develop confidence and approach challenges. An Advanced Program in UX & Algorithms from IISc, Bangalore has further strengthened the way I think about problem-solving, learning and the way people interact with complex ideas.

Within the first few minutes of sitting with a child, I can often tell whether they are genuinely stuck on the Maths, or whether they have started believing that they simply aren't good at it.

And that distinction matters.

If a child has missed a foundation, we need to go back and rebuild it.

If they understand the concept but don't trust themselves, we need to give them opportunities to experience that they can solve it.

And if they are ready for more, we need to help them move forward without making speed the goal in itself.

That's how I teach.

It's time to change how your kids approach Maths.

To make them more willing to attempt a difficult question. More comfortable making mistakes. More capable of finding their own way through a problem. And, to replace "I'm not good at Maths" with something much more important:

"Let me try."`,
  photo: '/assets/meenakshi-founder-portrait.jpg',
  photo_alt: 'Meenakshi Koul, founder and educator at The Vedic School',
  linkedin_url: 'https://www.linkedin.com/in/meenakshi-koul-14b101135/',
  created_at: '2026-09-12T00:00:00Z',
  updated_at: '2026-09-17T00:00:00Z',
};

export const DEFAULT_AUTHORS: readonly Author[] = [MEENAKSHI_KOUL_AUTHOR];
