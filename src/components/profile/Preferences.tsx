export default function Preferences() {
  return (
    <div>
      <h2 className="text-xl font-semibold pt-6">Preferences</h2>
      {["Theme", "Language", "Notification Sound"].map((item) => (
        <div key={item} className="flex items-center justify-between py-2">
          <p className="text-base">{item}</p>
          {item === "Language" ? (
            <p>English</p>
          ) : (
            <input type="checkbox" className="w-5 h-5" />
          )}
        </div>
      ))}
    </div>
  );
}
