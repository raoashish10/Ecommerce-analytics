import Link from "next/link"
import { Smartphone, Shirt, Home, Gamepad2 } from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: Smartphone,
    href: "/categories/electronics",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Fashion",
    icon: Shirt,
    href: "/categories/fashion",
    color: "bg-pink-500",
  },
  {
    id: 3,
    name: "Home & Garden",
    icon: Home,
    href: "/categories/home-garden",
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "Gaming",
    icon: Gamepad2,
    href: "/categories/gaming",
    color: "bg-purple-500",
  },
]

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category) => {
        const IconComponent = category.icon
        return (
          <Link
            key={category.id}
            href={category.href}
            className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`${category.color} p-8 text-center text-white`}>
              <IconComponent className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
