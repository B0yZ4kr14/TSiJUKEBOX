export const COMMIT_TYPES = {
  feat: { label: 'Feature', color: 'bg-green-500', textColor: 'text-green-500' },
  fix: { label: 'Bug Fix', color: 'bg-red-500', textColor: 'text-red-500' },
  docs: { label: 'Documentation', color: 'bg-blue-500', textColor: 'text-blue-500' },
  style: { label: 'Style', color: 'bg-purple-500', textColor: 'text-purple-500' },
  refactor: { label: 'Refactor', color: 'bg-orange-500', textColor: 'text-orange-500' },
  test: { label: 'Test', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  chore: { label: 'Chore', color: 'bg-gray-500', textColor: 'text-gray-500' },
  perf: { label: 'Performance', color: 'bg-cyan-500', textColor: 'text-cyan-500' },
  ci: { label: 'CI/CD', color: 'bg-indigo-500', textColor: 'text-indigo-500' },
  build: { label: 'Build', color: 'bg-amber-500', textColor: 'text-amber-500' },
  revert: { label: 'Revert', color: 'bg-rose-500', textColor: 'text-rose-500' },
  other: { label: 'Other', color: 'bg-slate-500', textColor: 'text-slate-500' },
} as const;

export type CommitType = keyof typeof COMMIT_TYPES;

export function parseCommitType(message: string): CommitType {
  const match = message.match(/^(\w+)(\(.+\))?[!]?:/);
  if (match && match[1] in COMMIT_TYPES) {
    return match[1] as CommitType;
  }
  return 'other';
}

export function getCommitTypeInfo(message: string) {
  const type = parseCommitType(message);
  return { type, ...COMMIT_TYPES[type] };
}

export function extractCommitScope(message: string): string | null {
  const match = message.match(/^\w+\(([^)]+)\)[!]?:/);
  return match ? match[1] : null;
}

export function isBreakingChange(message: string): boolean {
  return message.includes('!:') || message.toLowerCase().includes('breaking change');
}
