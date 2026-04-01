// Utilitaires communs pour le module Guest

/**
 * Formate une date en français
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formate une date relative (il y a X jours)
 */
export function formatRelativeDate(dateInput: Date | string | null | undefined): string {
  if (dateInput == null) {
    return "Date invalide";
  }

  if (typeof dateInput === 'string' && dateInput.trim() === '') {
    return "Date invalide";
  }

  // Conversion systématique en objet Date
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // Vérification si la date est valide
  if (isNaN(date.getTime())) {
    return "Date invalide";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;

  return formatDate(date);
}

/**
 * Tronque un texte avec des points de suspension
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Génère une couleur de badge en fonction du statut
 */
export function getStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    under_review: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    verified: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  };
  return colors[status] || colors.pending;
}
