export const formatINR = (amount: number): string => `₹${amount.toLocaleString("en-IN")}`;

/** Builds a responsive Unsplash URL from a photo id like "photo-152...". */
export const buildImageUrl = (photoId: string, width = 900, quality = 70): string =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=${quality}`;

export const discountPercent = (price: number, oldPrice?: number): number =>
  oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

export const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");
