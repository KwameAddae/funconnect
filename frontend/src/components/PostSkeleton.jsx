export default function PostSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-800" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-800 rounded" />
          <div className="h-2 w-16 bg-slate-800 rounded" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-slate-800 rounded" />
        <div className="h-3 w-5/6 bg-slate-800 rounded" />
        <div className="h-3 w-4/6 bg-slate-800 rounded" />
      </div>
    </div>
  );
}
