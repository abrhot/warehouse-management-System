export default function PasswordForm() {
  return (
    <div>
      <h2 className="text-xl font-semibold pt-6">Password Management</h2>
      {["Current Password", "New Password", "Confirm New Password"].map((label) => (
        <div key={label} className="flex flex-col gap-1 py-2">
          <label className="text-base font-medium">{label}</label>
          <input type="password" className="h-14 p-4 border border-[#dbe2d4] bg-[#fafbf9] rounded-xl" placeholder={`Enter ${label.toLowerCase()}`} />
        </div>
      ))}
      <button className="mt-2 bg-[#7bc142] text-sm font-bold px-4 py-2 rounded-xl">Update Password</button>
    </div>
  );
}
