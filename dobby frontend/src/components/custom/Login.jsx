import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { login } from '@/store/userSlice'
import { useDispatch } from 'react-redux'
import { apiUrl } from '@/lib/apiUrl'
import { useToast } from '../ui/use-toast'

const formSchema = z.object({


  email: z.string().email({
    message: 'Invalid email address.',

  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  
})

export function LoginForm() {
  const [loading,setLoading]=useState(false)
    const navigate=useNavigate();
    const {user}= useSelector((state) => state.user)
    const dispatch = useDispatch()
    const {toast} = useToast()

    useEffect(() => {
    if (user) {
      navigate("/upload-image")
    }
  }, [user, navigate])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      
    },
  })

  async function onSubmit(values) {
    setLoading(true);

    console.log(values)

    try{
        const res= await axios.post(`${apiUrl}/login`,{
          
          email:values.email,
          password:values.password,
      
        },
        {
          headers:{
            'Content-Type':'application/json'
          }
        }
        ) 
        setLoading(false);
        if(res.status===200){
         
          dispatch(login(res.data.userRes))
          toast({
            title: "Login successfully",
            description: "You are logged in",
            variant: "success",
          })
        }
        console.log(res)
    
        }
      catch(err){
        setLoading(false);
        console.log(err,"error has been occured")
        if(err.response.status===400){

          toast({
            title: "Invalid email or password",
            description: "Please enter valid email and password",
            variant: "destructive",
          })
        }
        if(err.response.status===500){
          toast({
            title: "Server error",
            description: "Please try again later",
            variant: "destructive",
          })
        }
        if(err.response.status===404){
          toast({
            title: "User not found",
            description: "Please enter valid email and password",
            variant: "destructive",
          })
        }
        else{
          toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          })
        }
      }
  }

  return (
    <div className="h-full flex items-center">
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
          rounded"
          disabled={loading}>
          {loading ? <Loader size={20} /> : "Login"}
        </Button>
        <div> Don't have an account?
        <Link to={"/signup"} className="text-blue-500"> Sign Up</Link>
        </div>
        </form>
    </Form>
    </div>
  )
}