export default function ProfileForm() {
  return (
    <form className="flex flex-col gap-4">
      {["Full Name", "Username", "Email Address", "Phone Number (Optional)"].map((label) => (
        <div key={label} className="flex flex-col gap-1">
          <label className="text-base font-medium">{label}</label>
          <input className="h-14 p-4 border border-[#dbe2d4] bg-[#fafbf9] rounded-xl" placeholder={`Enter ${label.toLowerCase()}`} />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button className="bg-[#7bc142] text-sm font-bold px-4 py-2 rounded-xl">Save Changes</button>
        <button className="bg-[#edf1ea] text-sm font-bold px-4 py-2 rounded-xl">Cancel</button>
      </div>
    </form>
  );
}
