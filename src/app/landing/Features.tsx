// src/components/landing/Features.tsx

const features = [
  {
    title: "Real-Time Inventory Updates",
    desc: "Get up-to-the-minute inventory status and stock levels.",
    icon: "📦",
  },
  {
    title: "Role-Based Access Control",
    desc: "Control access to different system features based on user roles.",
    icon: "🧑‍💼",
  },
  {
    title: "Comprehensive Stock Tracking",
    desc: "Track stock movements, locations, and quantities with ease.",
    icon: "🚚",
  },
  {
    title: "Detailed Reports and Analytics",
    desc: "Generate detailed reports on inventory, stock levels, and performance.",
    icon: "📊",
  },
];

export default function Features() {
  return (
    <section className="flex flex-col gap-10 py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#141b0e] max-w-[720px]">
          Key Features
        </h1>
        <p className="text-[#141b0e] text-base font-normal max-w-[720px]">
          Our WMS offers a comprehensive suite of tools to optimize your
          warehouse management.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-3 p-4 rounded-lg border border-[#dae6d1] bg-[#fafbf8]"
          >
            <div className="text-2xl">{f.icon}</div>
            <h2 className="text-[#141b0e] text-base font-bold">{f.title}</h2>
            <p className="text-[#6f9550] text-sm font-normal">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
