export default function UsersFilterBar() {
  return (
    <div className="flex gap-3 px-4 pb-2">
      {['Role', 'Status'].map((label) => (
        <button
          key={label}
          className="flex h-8 items-center gap-2 px-4 bg-[#edf1ea] rounded-xl text-sm font-medium text-[#141810]"
        >
          {label}
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M213.66,101.66...Z" />
          </svg>
        </button>
      ))}
    </div>
  )
}
