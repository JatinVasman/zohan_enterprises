const palette = ["bg-[#0D5C3A]", "bg-[#0F172A]", "bg-[#10B981]"]

function initialsOf(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function Avatar({ name, photo, size = 64, seed = 0 }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="rounded-full border-2 border-white object-cover shadow-sm"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      className={`flex items-center justify-center rounded-full border-2 border-white font-display font-bold text-white shadow-sm ${palette[seed % palette.length]}`}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initialsOf(name)}
    </span>
  )
}
