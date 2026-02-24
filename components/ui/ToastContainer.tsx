import { useState } from "react";

import Toast from "./Toast";

const ToastContainer = () => {
  const [toasts, setToasts] = useState<
    {
      id: string;
      message: string;
      variant?: "info" | "success" | "warning" | "error";
    }[]
  >([]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          id={t.id}
          message={t.message}
          variant={t.variant}
          onClose={(id) => setToasts((prev) => prev.filter((x) => x.id !== id))}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
