import { LIKERT_LABELS } from "@/types";

interface LikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
}

export default function LikertScale({ value, onChange }: LikertScaleProps) {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all ${
            value === score
              ? "border-coral-500 bg-coral-50 shadow-sm"
              : "border-beige-200 bg-white hover:border-coral-300 hover:bg-cream-50"
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              value === score
                ? "bg-coral-500 text-white"
                : "bg-beige-200 text-brown-600"
            }`}
          >
            {score}
          </span>
          <span className="text-brown-800">{LIKERT_LABELS[score - 1]}</span>
        </button>
      ))}
    </div>
  );
}
