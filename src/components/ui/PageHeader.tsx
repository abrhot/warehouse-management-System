type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <div className="px-4 py-4">
    <h1 className="text-[32px] font-bold text-[#141b0e]">{title}</h1>
    {subtitle && <p className="text-sm text-[#6f9550]">{subtitle}</p>}
  </div>
);
