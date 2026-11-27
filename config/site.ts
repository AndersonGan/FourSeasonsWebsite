/**
 * Launch / approval switches. See docs/OWNER_CHECKLIST.md.
 *
 * `npm run check:launch` fails while any of these are false, so a production
 * launch cannot happen by accident with unapproved content.
 */
export const approvals = {
  /** Owner has compared every menu name and price with the printed to-go menu. */
  menuApproved: true,
  /** Owner confirmed ordinary hours, phone, address and DoorDash link. */
  businessInfoApproved: false,
  /** Owner approved history and recognition wording on /about. */
  storyApproved: false,
  /** Owner approved the illustrated identity / wordmark (no supplied logo yet). */
  brandApproved: false,
} as const;

/**
 * While true, a small "Preview" note appears in the footer and the
 * menu shows an "awaiting owner confirmation" line, and search engines are
 * asked not to index the site. Flip to false only at launch.
 */
export const previewMode = true;

export const navigation = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our Story" },
  { href: "/gallery", label: "Gallery" },
  { href: "/visit", label: "Visit Us" },
] as const;
