import { AuthProvider } from './features/auth/context/AuthContext';
import { AppRoutes } from './components/routes';

function App() {

  const InterceptorBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return <>{children}</>;
  };

  return (
    <>
      <AuthProvider>
        <InterceptorBridge>
          <AppRoutes />
        </InterceptorBridge>
      </AuthProvider>
    </>
  )
}

export default App
