import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface FormItemInputProps {
  control: any;
  name: string;
  label?: string;
  placeholder: string;
  type?: string;
  description?: string;
  className?: string;
  inputClassname?: string;
  disabled?: boolean;
}

export function FormItem_Input({
  control,
  name,
  label,
  placeholder,
  type,
  description,
  className,
  inputClassname,
  disabled,
}: FormItemInputProps) {
  return (
   <div className={className}>
   <FormField
   control={control}
   name={name}
   render={({ field }) => (
      // removed className={className}
     <FormItem>
       {label && <FormLabel>{label}</FormLabel>}
       <FormControl>
         <Input
           className={inputClassname}
           type={type}
           placeholder={placeholder}
           {...field}
           disabled={disabled}
         />
       </FormControl>
       <FormMessage />
       {description && <FormDescription>{description}</FormDescription>}
     </FormItem>
   )}
 />
 </div>
);
}