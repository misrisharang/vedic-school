import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Layout } from '@/components/Layout';

import Home from '@/pages/Home';
import VedicMaths from '@/pages/VedicMaths';
import About from '@/pages/About';
import CurriculumAligned from '@/pages/CurriculumAligned';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/vedic-maths" component={VedicMaths} />
        <Route path="/about" component={About} />
        <Route path="/curriculum-aligned" component={CurriculumAligned} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
