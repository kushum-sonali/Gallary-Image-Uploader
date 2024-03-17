import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { login } from '@/store/userSlice'
import { apiUrl } from '@/lib/apiUrl'
import { useDispatch } from 'react-redux'
import { useToast } from '../ui/use-toast'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  phone: z.string().min(10, {
    message: 'Phone number must be at least 10 digits.',
  }),
})

export function SignupForm() {
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
      username: '',
      email: '',
      password: '',
      phone: '',
    },
  })

 async function onSubmit(values) {
    console.log(values)
    try{
    const res= await axios.post(`${apiUrl}/signup`,{
      username:values.username,
      email:values.email,
      password:values.password,
      phone:values.phone
    },
    {
      headers:{
        'Content-Type':'application/json'
      }
    }
    )
    if(res.status===200){
      dispatch(login(res.data))
      toast({
        title: "Signup successfully",
        description: "You have successfully signed up",
        variant: "success",
      })
    }
    console.log(res)

    }
  catch(err){
    console.log(err,"eccur has been occurs")
    toast({
      title: "Signup failed",
      description: "You have failed to sign up",
      variant: "destructive",
    })
  }
  
  }

  return (
    <div className="h-full flex   items-center">
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Enter Phone number" {...field} />
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
        ">Submit</Button>
        
        <div> Already have an Account? 

<Link to={"/"} className="text-blue-500"> Login</Link>
</div>
        </form>
    </Form>
    </div>
  )
}