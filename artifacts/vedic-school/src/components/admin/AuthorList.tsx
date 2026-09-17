// ==============================================================================
// THE VEDIC SCHOOL — ADMIN AUTHOR LIST COMPONENT
// ==============================================================================

import React, { useState, useEffect } from 'react';
import type { Author } from '@/types/blog';
import { fetchAuthors, getAuthorArticleCount } from '@/lib/authors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Loader2,
  FileText,
  Linkedin,
} from 'lucide-react';

interface AuthorListProps {
  onNewAuthor: () => void;
  onEditAuthor: (author: Author) => void;
}

export function AuthorList({ onNewAuthor, onEditAuthor }: AuthorListProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [articleCounts, setArticleCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const { authors: authorList } = await fetchAuthors();
      setAuthors(authorList);

      // Fetch article counts for each author
      const counts: Record<string, number> = {};
      for (const a of authorList) {
        counts[a.id] = await getAuthorArticleCount(a.id, a.name);
      }
      setArticleCounts(counts);
    } catch (err) {
      console.error('[Load Authors Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAuthors = authors.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      (a.role && a.role.toLowerCase().includes(q)) ||
      a.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Author Management
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Centralized author profiles referenced across blog articles. Updating an author profile updates their byline and public bio everywhere.
          </p>
        </div>

        <Button
          onClick={onNewAuthor}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white shadow-xs self-start sm:self-auto shrink-0 text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Author
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search authors by name, role, or slug..."
            className="pl-9 text-xs sm:text-sm border-0 bg-transparent focus-visible:ring-0 shadow-none h-8"
          />
        </div>
        <span className="text-xs text-stone-400 pr-2">
          {filteredAuthors.length} {filteredAuthors.length === 1 ? 'author' : 'authors'}
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[hsl(var(--primary))]" />
          <p className="text-sm font-medium">Loading authors...</p>
        </div>
      ) : filteredAuthors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800">No authors found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Create an author to assign bylines and generate public author profile pages.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAuthors.map((author) => {
            const articleCount = articleCounts[author.id] || 0;
            const updatedDate = author.updated_at
              ? new Date(author.updated_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Canonical';

            return (
              <div
                key={author.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  {/* Avatar / Photo */}
                  <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center text-stone-400">
                    {author.photo ? (
                      <img
                        src={author.photo}
                        alt={author.photo_alt || author.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // fallback if image path not found
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-serif font-bold text-stone-900 truncate">
                        {author.name}
                      </h3>
                      {author.linkedin_url && (
                        <a
                          href={author.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stone-400 hover:text-[#0A66C2] transition-colors"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-[hsl(var(--primary))] font-medium truncate mt-0.5">
                      {author.role || 'Educator'}
                    </p>

                    <div className="text-[11px] text-stone-400 font-mono mt-1">
                      /authors/{author.slug}
                    </div>

                    {author.bio && (
                      <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                        {author.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer bar */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full text-[11px]">
                      <FileText className="w-3 h-3 text-stone-500" />
                      {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                    </span>
                    <span className="text-[11px] text-stone-400">Updated: {updatedDate}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`/authors/${author.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
                      title="View public profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditAuthor(author)}
                      className="h-7 px-2 text-xs text-stone-600 hover:text-stone-900"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
