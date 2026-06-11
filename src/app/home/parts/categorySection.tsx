import Image from "next/image";
import { categoryData } from "@/constant/category-data";

interface CategorySectionProps {
  currentCategory: string;
  onSelectedCategory: (category: string) => void;
}

export default function CategorySection({
  currentCategory,
  onSelectedCategory,
}: CategorySectionProps) {
  return (
    // FIXED after hero backdrop image
    <section className="max-w-300 w-full mx-auto relative z-0 ">
      <div className="bg-white p-6 rounded-3xl shadow-xl grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 border border-gray-100">
        {categoryData.map((cat) => {
          const isActive = currentCategory === cat.category;
          return (
            <button
              key={cat.category}
              onClick={() => onSelectedCategory(cat.category)}
              className={`
                            p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                              isActive
                                ? cat.hoverBg +
                                  "border border-amber-500 scale-102"
                                : "border-gray-100 bg-white hover:bg-gray-50"
                            }
                            `}
            >
              <div className="relative w-12 h-12">
                <Image
                  src={cat.src}
                  alt={cat.alt}
                  fill
                  className="object-contain"
                />
              </div>
              <span
                className={`
                        text-xs font-bold tracking-tight text-center ${
                          isActive ? "text-amber-600" : "text-gray-600"
                        }
                        `}
              >
                {cat.category}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
