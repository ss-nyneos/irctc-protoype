interface RatingBadgeProps {
  value: number;
  reviews?: number;
}

export function RatingBadge({ value, reviews }: RatingBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#F26B21">
        <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" />
      </svg>
      <span className="font-bold text-foreground">{value.toFixed(1)}</span>
      {reviews != null && (
        <span className="text-muted-foreground">({reviews.toLocaleString("en-IN")})</span>
      )}
    </span>
  );
}
