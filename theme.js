// Brand colour comes from .env (EXPO_PUBLIC_PRIMARY_COLOR) so each shop's copy of the app has its own look.
// brand = fills (buttons, chips, cart bar); primary = text/icons/borders on white.
// For a light brand (e.g. yellow) text on fills turns dark and primary uses EXPO_PUBLIC_ACCENT_COLOR or a darker shade.
import { Platform } from 'react-native';

const isHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v || '');
const brand = isHex(process.env.EXPO_PUBLIC_PRIMARY_COLOR) ? process.env.EXPO_PUBLIC_PRIMARY_COLOR : '#1c1a17';
// Optional text colour on brand fills (e.g. cream on black); also tints the soft backgrounds
const onBrandEnv = isHex(process.env.EXPO_PUBLIC_ON_BRAND_COLOR) ? process.env.EXPO_PUBLIC_ON_BRAND_COLOR : null;

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * ch(n >> 16) + 0.7152 * ch((n >> 8) & 255) + 0.0722 * ch(n & 255);
}
const lightBrand = luminance(brand) > 0.4;

// Mix the brand colour with white (amount 0–1) for soft backgrounds
function tint(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.round(c + (255 - c) * amount);
  const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.round(c * (1 - amount));
  const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

const primary = isHex(process.env.EXPO_PUBLIC_ACCENT_COLOR)
  ? process.env.EXPO_PUBLIC_ACCENT_COLOR
  : lightBrand ? shade(brand, 0.5) : brand;

export const colors = {
  brand,
  onBrand: onBrandEnv || (lightBrand ? '#1a1a1a' : '#ffffff'),
  // Icons / text on the black buttons (− / + steppers, cart bar): the cream on black
  onBlack: onBrandEnv || (lightBrand ? brand : '#ffffff'),
  primary,
  primaryDark: shade(primary, 0.35),
  primarySoft: onBrandEnv && !lightBrand ? onBrandEnv : tint(brand, lightBrand ? 0.8 : 0.88),
  // Midnight Pizza: warm black ink on cream paper (matches the logo)
  black: '#1c1a17',
  surface: '#fffdf6',
  background: '#f4eedd',
  border: '#e3d8b8',
  text: '#1c1a17',
  muted: '#6b6352',
  faint: '#a39a85',
  success: '#15803d',
  successSoft: '#e7f6ec',
  danger: '#c0392b',
  dangerSoft: '#fbe9e7',
  warning: '#b45309',
  warningSoft: '#fdf1e2',
  sale: '#e11d48',
};

export const statusColors = {
  pending:          { fg: '#b45309', bg: '#fdf1e2' },
  confirmed:        { fg: '#1d4ed8', bg: '#e8eefc' },
  ready_for_delivery: { fg: '#0f766e', bg: '#e0f4f1' },
  out_for_delivery: { fg: '#7c3aed', bg: '#f1eafe' },
  ready:            { fg: '#7c3aed', bg: '#f1eafe' },
  delivered:        { fg: '#15803d', bg: '#e7f6ec' },
  completed:        { fg: '#ffffff', bg: '#15803d' },
  cancelled:        { fg: '#c0392b', bg: '#fbe9e7' },
  active:           { fg: '#15803d', bg: '#e7f6ec' },
  inactive:         { fg: '#64748b', bg: '#eef1f5' },
};

// Display face for titles: a serif, like the slab lettering in the logo
export const fonts = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
};
