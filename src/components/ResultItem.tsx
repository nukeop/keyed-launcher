interface ResultItemProps {
  title: string;
  subtitle?: string;
  icon?: string;
  isSelected?: boolean;
  onClick?: () => void;
  shortcut?: string;
}

export function ResultItem({
  title,
  subtitle,
  icon,
  isSelected = false,
  onClick,
  shortcut,
}: ResultItemProps) {
  return (
    <div
      className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 ${
        isSelected
          ? 'bg-blue-600/30 border-l-2 border-blue-400'
          : 'hover:bg-white/5'
      }`}
      onClick={onClick}
    >
      {icon && (
        <div className="w-8 h-8 mr-3 flex-shrink-0 flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="text-white font-medium truncate">{title}</div>
        {subtitle && (
          <div className="text-gray-400 text-sm truncate">{subtitle}</div>
        )}
      </div>

      {shortcut && (
        <div className="ml-3 text-xs text-gray-500 font-mono">{shortcut}</div>
      )}
    </div>
  );
}
