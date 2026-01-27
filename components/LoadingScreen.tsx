
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/60 rounded-full blur-[120px] animate-pulse-soft"></div>
      <div className="relative flex flex-col items-center gap-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl scale-150 animate-pulse"></div>
          <div className="absolute -inset-4 border border-emerald-100 rounded-full animate-[spin_10s_linear_infinite]"></div>
          <div className="w-24 h-24 md:w-32 md:h-32 relative z-10 animate-float-slow">
            <img 
              src="https://i.ibb.co/kgjLXphC/book-Converted.png" 
              alt="BoiSathi Logo" 
              className="w-full h-full object-contain drop-shadow-2xl" 
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 relative z-10 text-center">
          <div className="overflow-hidden">
            <div className="animate-reveal-up flex flex-col items-center">
              <h1 className="text-4xl md:text-6xl font-serif font-black text-black tracking-tight leading-none">
                BoiSathi<span className="text-accent italic">.com</span>
              </h1>
              <span className="text-xl md:text-3xl font-bn font-black text-accent mt-2">বইসাথী</span>
            </div>
          </div>
          <div className="w-64 h-1 bg-zinc-100 rounded-full overflow-hidden relative mt-2">
            <div className="absolute inset-y-0 bg-accent w-2/3 rounded-full animate-glimmer"></div>
          </div>
          <div className="flex flex-col items-center mt-2">
             <p className="text-[14px] md:text-[16px] font-bn font-black text-zinc-400 uppercase animate-pulse">
              পুরোনো বই, নতুন আশা
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
