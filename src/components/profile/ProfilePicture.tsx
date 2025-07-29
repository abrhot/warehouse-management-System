export default function ProfilePicture() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-video bg-cover bg-center rounded-xl" style={{ backgroundImage: "url('/images/profile.png')" }} />
      <div className="flex justify-between items-end">
        <p className="text-[#708a5c]">Upload or change your profile picture.</p>
        <button className="bg-[#7bc142] px-4 py-2 rounded-xl text-sm font-medium">Change Picture</button>
      </div>
    </div>
  );
}
