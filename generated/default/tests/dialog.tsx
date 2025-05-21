// components/ui/dialog.tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

// Root e Trigger
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

// Portal (necessário para renderizar o overlay + content)
export const DialogPortal = DialogPrimitive.Portal

// Overlay de fundo
export const DialogOverlay = (props: any) => (
  <DialogPrimitive.Overlay
    className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow"
    {...props}
  />
)

// Conteúdo da janela de diálogo
export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DialogPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />

    <DialogPrimitive.Content
      ref={ref}
      className={
        "fixed top-[50%] left-[50%] w-[90vw] max-w-md max-h-[85vh] " +
        "overflow-auto translate-x-[-50%] translate-y-[-50%] rounded-md " +
        "bg-white p-6 shadow-lg focus:outline-none " +
        (className ?? "")
      }
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
        <X size={20} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// Helpers de layout
export const DialogHeader: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="mb-4">{children}</div>
)
export const DialogFooter: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="mt-6 flex justify-end space-x-2">{children}</div>
)

// Títulos e descrições
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description