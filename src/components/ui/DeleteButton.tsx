type DeleteButtonProps = {
  onDelete: (() => void) | ((id: number) => void);
  id?: number;
  absolute?: boolean;
};

export const DeleteButton = ({ onDelete, id, absolute }: DeleteButtonProps) => {
  const handleClick = () => {
    if (id !== undefined) {
      (onDelete as (id: number) => void)(id);
    } else {
      (onDelete as () => void)();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${absolute ? 'absolute' : 'relative'} w-5 h-5 flex items-center justify-center group cursor-pointer`}
    >
      <span className="absolute top-1/2 left-1/2 w-4 h-1 bg-muted-foreground rotate-45 group-hover:bg-destructive transition-colors -translate-x-1/2 -translate-y-1/2" />
      <span className="absolute top-1/2 left-1/2 w-4 h-1 bg-muted-foreground -rotate-45 group-hover:bg-destructive transition-colors -translate-x-1/2 -translate-y-1/2" />
    </button>
  );
};
