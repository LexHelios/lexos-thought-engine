import { Suspense, lazy } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// Lazy load heavy components
const AgentWorkspace = lazy(() => import('./AgentWorkspace').then(module => ({ default: module.AgentWorkspace })));
const CodeIDE = lazy(() => import('./CodeIDE').then(module => ({ default: module.CodeIDE })));
const GitHubManager = lazy(() => import('./GitHubManager').then(module => ({ default: module.GitHubManager })));

interface LazyComponentProps {
  component: 'AgentWorkspace' | 'CodeIDE' | 'GitHubManager';
  props?: any;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({ component, props = {} }) => {
  const getComponent = () => {
    switch (component) {
      case 'AgentWorkspace':
        return <AgentWorkspace {...props} />;
      case 'CodeIDE':
        return <CodeIDE {...props} />;
      case 'GitHubManager':
        return <GitHubManager {...props} />;
      default:
        return <div>Component not found</div>;
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner size="lg" text="Loading component..." />}>
      {getComponent()}
    </Suspense>
  );
};