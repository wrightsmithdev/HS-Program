// Renders **bold** markdown segments as <strong>, everything else as plain text.
// Deliberately avoids dangerouslySetInnerHTML - splits into text nodes instead.
export default function Formatted({ text, as: Tag = 'span', className }) {
  if (!text) return null
  const parts = text.split(/\*\*(.+?)\*\*/g)

  return (
    <Tag className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-slate-900 dark:text-white">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </Tag>
  )
}
