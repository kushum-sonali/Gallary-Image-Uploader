import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
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
 
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  
})

export default function Resetpass() {
    const navigate=useNavigate();
    const {id,token}=useParams();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
     
    },
  })

  async function onSubmit(values) {
    console.log(values)
    try{
        const result=await axios.post(`${apiUrl}/reset-password/${id}/${token}`,{
            password:values.password,
        },{
            headers:{
                "Content-Type":"application/json"
            }
        });
        if(result.data){
            navigate("/login");
            console.log(result.data);
        }
    }
    catch(err){
        console.log(err);
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
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
        ">Update Password</Button>
        </form>
    </Form>
  )
}