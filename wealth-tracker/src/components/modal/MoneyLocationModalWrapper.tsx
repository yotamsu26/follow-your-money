interface ModalWrapperProps {
  isOpen: boolean;
  children: React.ReactNode;
  title: string;
}

export function MoneyLocationModalWrapper({
  isOpen,
  children,
  title,
}: ModalWrapperProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col relative my-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  );
}
