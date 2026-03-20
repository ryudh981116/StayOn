interface PriorityBadgeProps {
  priority: "High" | "Medium" | "Low";
  size?: "sm" | "md";
}

const config = {
  High: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    label: "긴급",
  },
  Medium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    label: "보통",
  },
  Low: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
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
