export function cn(...inputs: Array<string | number | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ');
}

export function formatAddress(address?: string | null) {
  if (!address) return '';
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatHash(hash?: string | null) {
  if (!hash) return '';
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}
