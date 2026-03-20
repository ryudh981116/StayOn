interface PriorityBadgeProps {
  priority: "High" | "Medium" | "Low";
  size?: "sm" | "md";
}

const config = {
  High: {
    bg: "bg-tertiary-fixed",
    text: "text-on-tertiary-fixed-variant",
    dot: "bg-error",
    label: "긴급",
  },
  Medium: {
    bg: "bg-primary-fixed",
    text: "text-on-primary-fixed-variant",
    dot: "bg-primary",
    label: "보통",
  },
  Low: {
    bg: "bg-surface-container-high",
    text: "text-on-surface-variant",
    dot: "bg-outline-variant",
    label: "낮음",
  },
};

export default function PriorityBadge({ priority, size = "sm" }: PriorityBadgeProps) {
  const c = config[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${c.bg} ${c.text} ${
        size === "sm" ? "text-[10px]" : "text-xs"
      } font-bold`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
