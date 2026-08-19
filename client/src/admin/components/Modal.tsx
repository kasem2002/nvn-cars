import { PropsWithChildren } from "react";

interface Props {
  title: string;
  onClose: () => void;
  wide?: boolean;
}

export function Modal({ title, onClose, wide, children }: PropsWithChildren<Props>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className={`max-h-[88vh] w-full overflow-y-auto rounded-lg border border-white/10 bg-[#131315] p-6 ${wide ? "max-w-2xl" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-xl text-white/50 hover:text-white">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
