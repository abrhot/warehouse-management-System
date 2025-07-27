import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="@container">
      <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAAFusO0QpKY4ppjijX7t7UTMGd2gJPk3N96VFhoi7FQvLYN6xTEB9I_IU-afNkXAwl9gSJO5pKIUR0cq0uAGkByjJD6eCKFDmKefCv5Jb4W8KdajwhFONgY2L8UbKHCX62D6CnFoRdtlttZB0MCj7jF2-ihng9NIRkQvdPrQ8BR-kzKttmAQajGQXzlnAb6-GGCj5z-bm_Pr3gCe9j26az92B_egige7eQu6uPhPSpSv48Jo2f-9nOW7NOMl6y_m6pz7xLrnGpkE4")' }}
        ></div>
        <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-[#141b0e] text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              EthioTele WMS
            </h1>
            <h2 className="text-[#141b0e] text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              Streamline your warehouse operations with our advanced Warehouse Management System. Track inventory, manage stock, and gain real-time insights.
            </h2>
          </div>
          <Link
            href="/login"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#78de24] text-[#141b0e] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
          >
            <span className="truncate">Login to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}