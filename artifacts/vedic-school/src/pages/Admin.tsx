// ==============================================================================
// THE VEDIC SCHOOL — ADMIN PAGE CONTAINER (/admin)
// ==============================================================================

import React, { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { ArticleList } from '@/components/admin/ArticleList';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { AuthorList } from '@/components/admin/AuthorList';
import { AuthorEditor } from '@/components/admin/AuthorEditor';
import type { BlogPost, Author } from '@/types/blog';
import { fetchAuthors, findAuthorByNameOrSlug } from '@/lib/authors';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  ExternalLink,
  ShieldCheck,
  Loader2,
  BookOpen,
  Users,
  FileText,
} from 'lucide-react';
import { Link } from 'wouter';

function AdminDashboard() {
  const { user, signOut } = useAdminAuth();
  const [currentView, setCurrentView] = useState<'articles' | 'editor' | 'authors' | 'author-editor'>('articles');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const handleNewArticle = () => {
    setEditingPost(null);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditArticle = (post: BlogPost) => {
    setEditingPost(post);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuthor = async (authorIdOrName: string) => {
    const { authors } = await fetchAuthors();
    const matched = findAuthorByNameOrSlug(authors, authorIdOrName) || authors.find(a => a.id === authorIdOrName) || authors[0] || null;
    setEditingAuthor(matched);
    setCurrentView('author-editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewAuthor = () => {
    setEditingAuthor(null);
    setCurrentView('author-editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditAuthor = (author: Author) => {
    setEditingAuthor(author);
    setCurrentView('author-editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSuccess = () => {
    setCurrentView('articles');
    setEditingPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthorSaveSuccess = () => {
    setCurrentView('authors');
    setEditingAuthor(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setCurrentView('articles');
    setEditingPost(null);
    setEditingAuthor(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col font-sans text-stone-900">
      {/* Admin Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & CMS Badge */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2.5 text-left focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                VS
              </div>
              <div>
                <div className="text-sm font-serif font-bold text-stone-900 leading-tight">
                  The Vedic School
                </div>
                <div className="text-[11px] font-medium text-stone-500">
                  Blog Publishing CMS
                </div>
              </div>
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              Authenticated
            </span>

            {/* Navigation Tabs */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-100/80 p-1 rounded-lg border border-stone-200 text-xs ml-2">
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setCurrentView('articles');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  currentView === 'articles' || currentView === 'editor'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Articles
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingAuthor(null);
                  setCurrentView('authors');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  currentView === 'authors' || currentView === 'author-editor'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Authors
              </button>
            </div>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[hsl(var(--primary))] transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-50"
            >
              <span>View Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 pl-3 border-l border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="truncate max-w-[180px] font-medium text-stone-700">
                {user?.email}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={signOut}
              className="h-8 px-2.5 text-xs text-stone-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 border-stone-200"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Log Out</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="sm:hidden flex items-center justify-around border-t border-stone-200 bg-white px-4 py-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setEditingPost(null);
              setCurrentView('articles');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${
              currentView === 'articles' || currentView === 'editor'
                ? 'bg-stone-100 text-stone-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Articles
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingAuthor(null);
              setCurrentView('authors');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${
              currentView === 'authors' || currentView === 'author-editor'
                ? 'bg-stone-100 text-stone-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Authors
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'articles' && (
          <ArticleList
            onNewArticle={handleNewArticle}
            onEditArticle={handleEditArticle}
            onOpenAuthor={handleOpenAuthor}
          />
        )}
        {currentView === 'editor' && (
          <ArticleEditor
            post={editingPost}
            onSaveSuccess={handleSaveSuccess}
            onCancel={handleCancel}
          />
        )}
        {currentView === 'authors' && (
          <AuthorList
            onNewAuthor={handleNewAuthor}
            onEditAuthor={handleEditAuthor}
          />
        )}
        {currentView === 'author-editor' && (
          <AuthorEditor
            author={editingAuthor}
            onSaveSuccess={handleAuthorSaveSuccess}
            onCancel={() => setCurrentView('authors')}
          />
        )}
      </main>
    </div>
  );
}

function AdminRoot() {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--primary))]" />
        <p className="text-xs font-medium text-stone-500">Checking administrator session...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}

export default function Admin() {
  React.useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Admin | The Vedic School';

    let robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    let createdRobots = false;
    let originalRobots = '';

    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.content = 'noindex, nofollow';
      document.head.appendChild(robotsMeta);
      createdRobots = true;
    } else {
      originalRobots = robotsMeta.content;
      robotsMeta.content = 'noindex, nofollow';
    }

    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const originalCanonical = canonicalLink?.getAttribute('href') || null;
    if (canonicalLink) {
      canonicalLink.remove();
    }

    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    const removedScripts: { node: Node; parent: Node }[] = [];
    jsonLdScripts.forEach((script) => {
      if (script.parentNode) {
        removedScripts.push({ node: script, parent: script.parentNode });
        script.parentNode.removeChild(script);
      }
    });

    return () => {
      if (
        !originalTitle ||
        originalTitle.toLowerCase().includes('admin') ||
        originalTitle.includes('404')
      ) {
        document.title = 'The Vedic School | Vedic Maths & Curriculum-Aligned Classes';
      } else {
        document.title = originalTitle;
      }

      if (robotsMeta) {
        if (createdRobots) {
          robotsMeta.remove();
        } else {
          robotsMeta.content = originalRobots;
        }
      }

      if (originalCanonical) {
        const restoredCanonical = document.createElement('link');
        restoredCanonical.rel = 'canonical';
        restoredCanonical.href = originalCanonical;
        document.head.appendChild(restoredCanonical);
      }

      removedScripts.forEach(({ node, parent }) => {
        parent.appendChild(node);
      });
    };
  }, []);

  return (
    <AdminAuthProvider>
      <AdminRoot />
    </AdminAuthProvider>
  );
}
