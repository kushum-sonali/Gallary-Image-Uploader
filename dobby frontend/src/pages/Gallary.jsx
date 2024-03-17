import { CardHeader, CardContent, Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSelector } from "react-redux"
import { useEffect,useState } from "react"
import { useNavigate,useParams } from "react-router"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { apiUrl } from "@/lib/apiUrl"

export default function Gallary() {
  const { user } = useSelector((state) => state.user)
  const { uid } = useParams()
  const navigate = useNavigate()
  const {toast} = useToast()
  const [images, setImages] = useState([])
  async function getAllImages() {
    try {
      const res = await axios.get(`${apiUrl}/images/${uid}`)
      console.log(res.data)
      setImages(res.data)
    } catch (error) {
      console.log(error)
      toast({ 
        title: "Error",
        description: "Something went wrong",
      })
    }
  }
    useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])
   
  useEffect(() => {
    if(user){
      if(user.uid != uid){
        navigate('/');
        toast({
          title: "Unauthorized",
          message: "You are not authorized to view this page",
        })
      }
      else{
        getAllImages()
      }
    }
  }, [user,uid])

  return (
    <main className="grid sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto p-4 h-auto">
      {images?.map((image) => (
      <Dialog key={image._id} size="lg">
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <img
                alt={image.name}
                className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800 hover:scale-105 transition-transform duration-300"
                height="300"
                src={image.path}
                width="300"
              />
            </CardHeader>
            <CardContent>
              <h2 className="text-lg font-bold">{image.name}</h2>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{image.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <img
              alt={image.name}
              className="aspect-square object-contain border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
              height="300"
              src={image.path}
              width="300"
            />
          </DialogDescription>
          
        </DialogContent>
      </Dialog>
      ))}

    </main>
  )
}
