import { z } from "zod";

export const accountFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last Name be at least 2 characters.",
  }),

  email: z.string().email({message: "Please enter a valid email address.",}),
    phone_number: z.string().optional(),
    mobile_number: z.string().optional(),
    username: z.string().min(5, { message: "Username must be at least 5 characters." }).min(30, { message: "Username must be at less than 30 characters." })

  

})

