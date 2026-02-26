interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal = ({ open, onClose, title, children }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-(--bg-card) border border-(--border-default) rounded-lg w-full max-w-lg p-4 shadow-xl">
        {title && (
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-(--text-muted) hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
