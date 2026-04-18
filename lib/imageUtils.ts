/**
 * lib/imageUtils.ts
 *
 * Central image path resolution for places and packages.
 *
 * Priority order:
 *   1. DB thumbnail URL (set by admin via Cloudinary upload)
 *   2. Local public file: /images/places/{slug}.jpg
 *   3. null → component renders gradient placeholder
 *
 * This means:
 *   - If you upload via admin panel → Cloudinary URL is used
 *   - If you drop a file in /public/images/places/ → local file is used
 *   - If neither exists → beautiful gradient fallback, no broken image
 */

// ─── Place images ─────────────────────────────────────────────────────────────

/**
 * Returns the image src to use for a place card/detail.
 * @param slug    - place slug (matches filename in /public/images/places/)
 * @param dbUrl   - thumbnail URL stored in MongoDB (from Cloudinary upload)
 */
export function getPlaceImageSrc(slug: string, dbUrl?: string): string | null {
  if (dbUrl && dbUrl.trim()) return dbUrl
  if (slug)                   return `/images/places/${slug}.jpg`
  return null
}

/**
 * Returns the array of image srcs for a place detail gallery.
 */
export function getPlaceGallery(slug: string, dbImages: string[]): string[] {
  const filtered = dbImages.filter(Boolean)
  if (filtered.length > 0) return filtered
  return [`/images/places/${slug}.jpg`]
}

// ─── Package images ───────────────────────────────────────────────────────────

/**
 * Returns the image src for a package card.
 */
export function getPackageImageSrc(slug: string, dbUrl?: string): string | null {
  if (dbUrl && dbUrl.trim()) return dbUrl
  if (slug)                   return `/images/packages/${slug}.jpg`
  return null
}

// ─── Type → gradient colours ─────────────────────────────────────────────────
// Used as the fallback background when no image exists

type PlaceType = 'temple' | 'ghat' | 'sacred-site' | 'hill' | 'garden' | 'museum' | 'village' | string

const TYPE_GRADIENTS: Record<string, string> = {
  temple:       'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
  ghat:         'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  'sacred-site':'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
  hill:         'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
  garden:       'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)',
  museum:       'linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%)',
  village:      'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
}

const PACKAGE_GRADIENT = 'linear-gradient(135deg, #fff8ed 0%, #ffefd4 50%, #fff3e0 100%)'

export function getPlaceGradient(type: PlaceType): string {
  return TYPE_GRADIENTS[type] ?? TYPE_GRADIENTS.temple
}

export function getPackageGradient(): string {
  return PACKAGE_GRADIENT
}

// ─── Type → emoji ─────────────────────────────────────────────────────────────

const TYPE_EMOJI: Record<string, string> = {
  temple:       '🛕',
  ghat:         '🌊',
  'sacred-site':'🙏',
  hill:         '⛰️',
  garden:       '🌺',
  museum:       '🏛️',
  village:      '🏡',
  market:       '🛒',
}

export function getTypeEmoji(type: string): string {
  return TYPE_EMOJI[type] ?? '📍'
}