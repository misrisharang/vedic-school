import { useEffect } from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Layout } from '@/components/Layout';

import Home from '@/pages/Home';
import VedicMaths from '@/pages/VedicMaths';
import About from '@/pages/About';
import CurriculumAligned from '@/pages/CurriculumAligned';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import Admin from '@/pages/Admin';
import Blog from '@/pages/Blog';
import BlogPostPage from '@/pages/BlogPostPage';
import AuthorProfile from '@/pages/AuthorProfile';

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/admin/:rest*" component={Admin} />
      <Route>
        <Layout>
          <ScrollToTop />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/vedic-maths" component={VedicMaths} />
            <Route path="/about" component={About} />
            <Route path="/curriculum-aligned" component={CurriculumAligned} />
            <Route path="/contact" component={Contact} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPostPage} />
            <Route path="/authors/:slug" component={AuthorProfile} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />
            <Route path="/cookie-policy" component={CookiePolicy} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

import { DemoModalProvider } from '@/context/DemoModalContext';
import { SundayDemoModal } from '@/components/SundayDemoModal';
import { PersonalAssessmentModal } from '@/components/PersonalAssessmentModal';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DemoModalProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <SundayDemoModal />
          <PersonalAssessmentModal />
          <Toaster />
        </DemoModalProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
