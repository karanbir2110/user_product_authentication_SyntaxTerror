import { Factory, CheckCircle, Ship, Warehouse, Store } from "lucide-react";
import { timelineData } from "@/data/mockData";
import { useEffect, useRef, useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  factory: <Factory className="w-5 h-5" />,
  check: <CheckCircle className="w-5 h-5" />,
  ship: <Ship className="w-5 h-5" />,
  warehouse: <Warehouse className="w-5 h-5" />,
  store: <Store className="w-5 h-5" />,
};

const Timeline = () => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.3 }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-8">
        {timelineData.map((item, i) => (
          <div
            key={i}
            ref={(el) => (refs.current[i] = el)}
            data-index={i}
            className={`relative pl-16 md:pl-20 transition-all duration-700 ${
              visibleItems.has(i)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {/* Icon circle */}
            <div className="absolute left-3 md:left-5 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {iconMap[item.icon]}
            </div>

            <div className="glass-card rounded-xl p-4">
              <p className="font-serif font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.location}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
