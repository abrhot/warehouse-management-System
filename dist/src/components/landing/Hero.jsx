"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Hero;
function Hero() {
    return (<section className="flex flex-col lg:flex-row gap-10 items-center px-4 max-w-7xl mx-auto">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAFusO0QpKY4ppjijX7t7UTMGd2gJPk3N96VFhoi7FQvLYN6xTEB9I_IU-afNkXAwl9gSJO5pKIUR0cq0uAGkByjJD6eCKFDmKefCv5Jb4W8KdajwhFONgY2L8UbKHCX62D6CnFoRdtlttZB0MCj7jF2-ihng9NIRkQvdPrQ8BR-kzKttmAQajGQXzlnAb6-GGCj5z-bm_Pr3gCe9j26az92B_egige7eQu6uPhPSpSv48Jo2f-9nOW7NOMl6y_m6pz7xLrnGpkE4" alt="Warehouse Illustration" className="rounded-xl w-full max-w-md lg:max-w-sm object-cover aspect-video" style={{ maxHeight: '280px' }}/>

      <div className="flex flex-col gap-4 text-left max-w-xl">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
          EthioTele WMS
        </h1>
        <p className="text-base text-[#141b0e]">
          Streamline your warehouse operations with our advanced Warehouse Management System. Track inventory, manage stock, and gain real-time insights.
        </p>
        <a href="/login" className="bg-[#78de24] hover:bg-lime-500 text-[#141b0e] font-bold text-base px-6 py-3 rounded-lg w-fit">
          Login to Dashboard
        </a>
      </div>
    </section>);
}
