// app/derivative-swipe/page.tsx
import { Suspense } from "react";
import { SwipeCard } from "@/components/layout/SwipeCard";
import { fetchDerivativeNews } from "@/lib/newsClient";
// wrapper async untuk fetch data
async function NewsSwipeContent() {
    const newsList = await fetchDerivativeNews();

    if (newsList.length === 0) {
        return (
            <div className="w-full max-w-md mx-auto text-center py-12 text-slate-200">
                No news available yet.
            </div>
        );
    }

    // biarkan SwipeCard yang ngatur layout “handphone”
    return <SwipeCard newsList={newsList} />;
}

export default function Page() {
    return (
        <Suspense fallback={
            <>
              <div className="flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-200">
                Loading news cards...
              </div>
            </>
        }>
            <main className=" w-full flex items-center justify-center bg-gradient-to-br ">
                <NewsSwipeContent />
            </main>
        </Suspense>
    );
}
