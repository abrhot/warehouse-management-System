// src/components/landing/Hero.tsx

export default function Hero() {
  return (
    <section className="flex flex-col gap-6 sm:flex-row py-10">
      <div
        className="w-full aspect-video rounded-xl bg-cover bg-center bg-no-repeat sm:min-w-[400px] sm:h-auto"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAFusO0QpKY4ppjijX7t7UTMGd2gJPk3N96VFhoi7FQvLYN6xTEB9I_IU-afNkXAwl9gSJO5pKIUR0cq0uAGkByjJD6eCKFDmKefCv5Jb4W8KdajwhFONgY2L8UbKHCX62D6CnFoRdtlttZB0MCj7jF2-ihng9NIRkQvdPrQ8BR-kzKttmAQajGQXzlnAb6-GGCj5z-bm_Pr3gCe9j26az92B_egige7eQu6uPhPSpSv48Jo2f-9nOW7NOMl6y_m6pz7xLrnGpkE4')",
        }}
      ></div>
      <div className="flex flex-col gap-6 sm:min-w-[400px] sm:justify-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#141b0e] leading-tight tracking-tight">
            EthioTele WMS
          </h1>
          <h2 className="text-sm sm:text-base font-normal text-[#141b0e] mt-2">
            Streamline your warehouse operations with our advanced Warehouse
            Management System. Track inventory, manage stock, and gain real-time
            insights.
          </h2>
        </div>
        <a
          href="/(auth)/login"
          className="bg-[#78de24] text-[#141b0e] font-bold text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 rounded-xl flex items-center justify-center max-w-[480px]"
        >
          Login to Dashboard
        </a>
      </div>
    </section>
  );
}
