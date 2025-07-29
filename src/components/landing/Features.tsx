import {
  Building2,
  Users,
  Package,
  BarChart2,
} from "lucide-react"; // Optional: use lucide icons

const features = [
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Real-Time Inventory Updates",
    description: "Get up-to-the-minute inventory status and stock levels.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Role-Based Access Control",
    description: "Control access to different system features based on user roles.",
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "Comprehensive Stock Tracking",
    description: "Track stock movements, locations, and quantities with ease.",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Detailed Reports and Analytics",
    description:
      "Generate detailed reports on inventory, stock levels, and warehouse performance.",
  },
];

export default function Features() {
  return (
    <section className="mt-20">
      <h2 className="text-3xl lg:text-4xl font-black mb-4">Key Features</h2>
      <p className="text-[#141b0e] text-base mb-10 max-w-2xl">
        Our WMS offers a comprehensive suite of tools to optimize your warehouse management.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="border border-[#dae6d1] bg-white rounded-xl p-5 flex flex-col gap-2"
          >
            <div className="text-[#141b0e]">{f.icon}</div>
            <h3 className="text-base font-bold">{f.title}</h3>
            <p className="text-sm text-[#6f9550]">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
