import Skeleton from "@/components/Skeleton/Skeleton";

const ChatSkeleton = () => {
  return (
    <main className="w-[70%] flex flex-col bg-secondary">
      {/* Encabezado de conversación */}
      <header className="w-full min-h-[8%] bg-primary flex items-center px-4">
        <Skeleton className="w-1/3 h-5" />
      </header>

      {/* Sección de mensajes */}
      <section className="w-full min-h-[85%] px-5 pt-8 bg-[url('/images/darkbackground.svg')] bg-cover bg-center flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <Skeleton className="w-1/2 h-4 mb-2" />
            <Skeleton className="w-1/3 h-4" />
          </div>
        ))}
      </section>

      {/* Input de mensaje */}
      <div className="w-full h-[6%] flex justify-between items-center border-t px-4 pb-2 gap-4">
        <Skeleton className="w-[5%] h-10 rounded-full" />
        <Skeleton className="w-[5%] h-10 rounded-full" />
        <Skeleton className="w-[80%] h-10 rounded-3xl" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </main>
  );
};

export default ChatSkeleton;
