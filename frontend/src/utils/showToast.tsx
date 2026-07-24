import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const baseToastClass = `
  max-w-md w-full 
  bg-surface 
  shadow-xl 
  rounded-xl 
  p-4 
  flex 
  items-start 
  gap-4 
  pointer-events-auto 
  transition-all 
  duration-300
  border border-border
`;

const closeButtonClass = `
  p-1.5 
  -mt-1
  -mr-1
  rounded-md 
  text-text-muted 
  hover:text-text 
  hover:bg-surface-secondary 
  transition-all 
  shrink-0
  cursor-pointer
  relative
  z-50
`;

export const showToast = {
  success: (message: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible
              ? 'animate-in fade-in zoom-in-95 slide-in-from-top-4'
              : 'animate-out fade-out zoom-out-95 slide-out-to-top-2'
          } ${baseToastClass} border-l-4 border-l-success`}
        >
          <div className="p-2 rounded-full bg-success/10 text-success shrink-0 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm font-bold text-text tracking-tight">
              Success
            </p>
            <p className="text-sm text-text-muted mt-1 leading-relaxed break-words font-medium">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.remove(t.id); // instantly destroys the toast
            }}
            className={closeButtonClass}
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ),
      { duration: 4000 }
    );
  },

  error: (message: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible
              ? 'animate-in fade-in zoom-in-95 slide-in-from-top-4'
              : 'animate-out fade-out zoom-out-95 slide-out-to-top-2'
          } ${baseToastClass} border-l-4 border-l-danger`}
        >
          <div className="p-2 rounded-full bg-danger/10 text-danger shrink-0 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm font-bold text-text tracking-tight">
              Action Failed
            </p>
            <p className="text-sm text-text-muted mt-1 leading-relaxed break-words font-medium">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.remove(t.id); // instantly destroys the toast
            }}
            className={closeButtonClass}
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ),
      { duration: 4000 }
    );
  },

  info: (message: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible
              ? 'animate-in fade-in zoom-in-95 slide-in-from-top-4'
              : 'animate-out fade-out zoom-out-95 slide-out-to-top-2'
          } ${baseToastClass} border-l-4 border-l-brand-500`}
        >
          <div className="p-2 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm font-bold text-text tracking-tight">
              Information
            </p>
            <p className="text-sm text-text-muted mt-1 leading-relaxed break-words font-medium">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.remove(t.id); // instantly destroys the toast
            }}
            className={closeButtonClass}
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ),
      { duration: 4000 }
    );
  },
};