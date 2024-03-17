import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { apiUrl } from '@/lib/apiUrl' 

const formSchema = z.object({
 
  email: z.string().email({
    message: 'Invalid email address.',
  }),

})

export default function Forgetpass() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values) {
    console.log(values)
    try {
        const result = await axios.post(`${apiUrl}/forgetpass`, {
            email: values.email // Make sure 'email' variable is defined and holds the correct email address
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        // if (result.data) {
        //     toast.success("Email sent successfully");
        // }
        console.log(result.data);
    } catch (err) {
        console.log(err);
        // You can add more detailed error logging here if needed
    }
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 
      bg-purple-200
      text-gray-800
      p-8
      rounded-lg
      shadow-lg
      w-96
      border-2
      
      ">
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Registered Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
     
        <Button type="submit" className="
          bg-blue-500
          hover:bg-blue-700
          text-white
          font-bold
          py-2
          px-4
          rounded
        ">Send</Button>
        </form>
    </Form>
  )
}