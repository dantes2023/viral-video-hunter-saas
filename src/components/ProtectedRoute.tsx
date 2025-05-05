
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Mostra nada enquanto verifica autenticação
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Se o usuário estiver autenticado, renderiza o conteúdo protegido
  return user ? <>{children}</> : null;
};
