import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

//
// ─── ROOT, TRIGGER & PORTAL ───────────────────────────────────────────────────
//
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal

//
// ─── OVERLAY ──────────────────────────────────────────────────────────────────
//
export const DialogOverlay: React.FC<
  React.ComponentProps<typeof DialogPrimitive.Overlay>
> = (props) => (
  <DialogPrimitive.Overlay
    className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow"
    {...props}
  />
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

//
// ─── CONTENT ──────────────────────────────────────────────────────────────────
//
export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DialogPrimitive.Content>
>(({ children, className = "", ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />

    <DialogPrimitive.Content
      ref={ref}
      className={[
        "fixed top-[50%] left-[50%] w-[90vw] max-w-md max-h-[85vh]",
        "overflow-auto -translate-x-1/2 -translate-y-1/2",
        "rounded-md bg-white p-6 shadow-lg focus:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        aria-label="Fechar"
      >
        <X size={20} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

//
// ─── HEADER & FOOTER HELPERS ─────────────────────────────────────────────────
//
export const DialogHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="mb-4">{children}</div>
)
DialogHeader.displayName = "DialogHeader"

export const DialogFooter: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="mt-6 flex justify-end space-x-2">{children}</div>
)
DialogFooter.displayName = "DialogFooter"

//
// ─── TITLE & DESCRIPTION ─────────────────────────────────────────────────────
//
export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>((props, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className="text-lg font-semibold text-gray-900"
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>((props, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className="text-sm text-gray-500"
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName
