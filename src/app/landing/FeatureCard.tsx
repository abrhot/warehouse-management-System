import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-1 gap-3 rounded-lg border border-[#dae6d1] bg-[#fafbf8] p-4 flex-col">
      <div className="text-[#141b0e]">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-[#141b0e] text-base font-bold leading-tight">{title}</h2>
        <p className="text-[#6f9550] text-sm font-normal leading-normal">{description}</p>
      </div>
    </div>
  );
}