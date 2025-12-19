import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBackNavigation } from '../useBackNavigation';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Mocks
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { info: vi.fn() },
}));

describe('useBackNavigation', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  // Cenário 1: Com histórico - deve chamar navigate(-1)
  it('should navigate back when history exists', () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ key: 'abc123' });
    const { result } = renderHook(() => useBackNavigation());
    
    act(() => result.current.goBack());
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(toast.info).not.toHaveBeenCalled();
  });

  // Cenário 2: Sem histórico - deve ir para fallback e mostrar toast
  it('should navigate to fallback and show toast when no history', () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ key: 'default' });
    const { result } = renderHook(() => useBackNavigation());
    
    act(() => result.current.goBack());
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(toast.info).toHaveBeenCalledWith('Redirecionando para a página inicial');
  });

  // Cenário 3: Fallback customizado
  it('should use custom fallback path', () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ key: 'default' });
    const { result } = renderHook(() => 
      useBackNavigation({ fallbackPath: '/dashboard' })
    );
    
    act(() => result.current.goBack());
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  // Cenário 4: Toast desabilitado
  it('should not show toast when disabled', () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ key: 'default' });
    const { result } = renderHook(() => 
      useBackNavigation({ showToast: false })
    );
    
    act(() => result.current.goBack());
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(toast.info).not.toHaveBeenCalled();
  });

  // Cenário 5: Mensagem de toast customizada
  it('should show custom toast message', () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ key: 'default' });
    const { result } = renderHook(() => 
      useBackNavigation({ toastMessage: 'Voltando ao início' })
    );
    
    act(() => result.current.goBack());
    
    expect(toast.info).toHaveBeenCalledWith('Voltando ao início');
  });

  // Cenário 6: hasHistory deve retornar valor correto
  it('should return correct hasHistory value', () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ key: 'abc123' });
    const { result: withHistory } = renderHook(() => useBackNavigation());
    expect(withHistory.current.hasHistory).toBe(true);

    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ key: 'default' });
    const { result: noHistory } = renderHook(() => useBackNavigation());
    expect(noHistory.current.hasHistory).toBe(false);
  });
});
