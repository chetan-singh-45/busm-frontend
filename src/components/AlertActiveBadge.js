import { Bell } from 'lucide-react'

export default function AlertActiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium bg-green-100 px-2 py-0.5 rounded-full">
      <Bell className="text-[#25C935]" size={16} />
    </span>
  );
}
