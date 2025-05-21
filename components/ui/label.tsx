// components/ui/Label.tsx
import * as React from "react"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string
}

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  ...props
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700"
    {...props}
  >
    {children}
  </label>
)
