import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CodeIssue {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'security' | 'performance' | 'maintainability' | 'style';
  title: string;
  message: string;
  line: number | null;
  suggestion?: string;
}

export interface CodeScanResult {
  fileName: string;
  issues: CodeIssue[];
  summary: string;
  score: number;
  scannedAt: string;
}

export interface UseCodeScanReturn {
  results: CodeScanResult[];
  isScanning: boolean;
  progress: number;
  error: string | null;
  scanCode: (code: string, fileName: string) => Promise<CodeScanResult | null>;
  scanMultiple: (files: { code: string; fileName: string }[]) => Promise<void>;
  clearResults: () => void;
  getIssuesBySeverity: (severity: CodeIssue['severity']) => CodeIssue[];
  totalIssues: number;
  criticalCount: number;
  averageScore: number;
}

export function useCodeScan(): UseCodeScanReturn {
  const [results, setResults] = useState<CodeScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const scanCode = useCallback(async (code: string, fileName: string): Promise<CodeScanResult | null> => {
    try {
      const response = await supabase.functions.invoke('code-scan', {
        body: { code, fileName, scanType: 'all' },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Scan failed');
      }

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Scan failed');
      }

      const result: CodeScanResult = response.data.data;
      setResults((prev) => [...prev.filter((r) => r.fileName !== fileName), result]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[useCodeScan] Error scanning ${fileName}:`, errorMessage);
      throw err;
    }
  }, []);

  const scanMultiple = useCallback(async (files: { code: string; fileName: string }[]) => {
    setIsScanning(true);
    setProgress(0);
    setError(null);

    const totalFiles = files.length;
    let completed = 0;

    try {
      for (const file of files) {
        await scanCode(file.code, file.fileName);
        completed++;
        setProgress(Math.round((completed / totalFiles) * 100));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsScanning(false);
      setProgress(100);
    }
  }, [scanCode]);

  const clearResults = useCallback(() => {
    setResults([]);
    setProgress(0);
    setError(null);
  }, []);

  const getIssuesBySeverity = useCallback(
    (severity: CodeIssue['severity']): CodeIssue[] => {
      return results.flatMap((r) => r.issues.filter((i) => i.severity === severity));
    },
    [results]
  );

  const totalIssues = results.reduce((acc, r) => acc + r.issues.length, 0);
  const criticalCount = results.reduce(
    (acc, r) => acc + r.issues.filter((i) => i.severity === 'critical').length,
    0
  );
  const averageScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0;

  return {
    results,
    isScanning,
    progress,
    error,
    scanCode,
    scanMultiple,
    clearResults,
    getIssuesBySeverity,
    totalIssues,
    criticalCount,
    averageScore,
  };
}
