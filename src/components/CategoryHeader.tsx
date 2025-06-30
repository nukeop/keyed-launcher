interface CategoryHeaderProps {
  title: string;
  icon?: string;
  'data-testid'?: string;
}

export function CategoryHeader({
  title,
  icon,
  'data-testid': testId,
}: CategoryHeaderProps) {
  return (
    <div
      className="px-2 py-1 text-xs font-medium tracking-wide text-gray-400 uppercase"
      data-testid={testId}
    >
      <div className="flex items-center">
        {icon && <span className="mr-2 text-sm">{icon}</span>}
        {title.toUpperCase()}
      </div>
    </div>
  );
}
