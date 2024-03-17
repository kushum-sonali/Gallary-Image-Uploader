import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/apiUrl";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const formSchema = z.object({
  file: z.instanceof(FileList).refine((value) => value.length > 0, {
    message: "Image is required.",
  }),
  imageName: z.string().min(1, {
    message: "Image name is required.",
  }),
})

export default function UploadImage() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
      imageName: "",
    },
  });

  const fileRef = form.register("file");
  const imageNameRef = form.register("imageName");

  const onSubmit = async(data) => {
    console.log(data);
    setIsUploading(true);
    try {
       const formData = new FormData();
      formData.append("file", data.file[0]);
      formData.append("name", data.imageName);
      formData.append("user", user.uid);
      const res = await axios.post(`${apiUrl}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      setIsUploading(false);
      toast({
        title: "Image uploaded successfully",
      });
      navigate(`/gallary/${user.uid}`);

    } catch (error) {
      console.error(error);
      setIsUploading(false);
      toast({
        title: "Image upload failed",
        variant: "destructive",
      });
    }
  };

 

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} style={{ maxWidth: '500px', margin: 'auto', padding: '1rem', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="file" style={{ display: 'block', marginBottom: '.5rem', color: '#333', fontWeight: 'bold' }}>Upload Image</label>
        <input
          type="file"
          id="file"
          style={{ display: 'block', width: '100%', padding: '.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          {...fileRef}
          disabled={isUploading}
          onChange={(e) => {
            if (e.target.files[0]) {
              setPreview(URL.createObjectURL(e.target.files[0]));
              setImageName(e.target.files[0].name);
              form.setValue("imageName", e.target.files[0].name); // Update the form value for imageName
            }
            else{
              setPreview("");
              setImageName("");
            }
          }}
        />
      </div>

      {preview && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <img src={preview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="imageName" style={{ display: 'block', marginBottom: '.5rem', color: '#333', fontWeight: 'bold' }}>Image Name</label>
            <input
              type="text"
              id="imageName"
              value={imageName}
              disabled={isUploading}
                onChange={(e) => {
                  form.setValue("imageName", e.target.value); // Update the form value for imageName
                  setImageName(e.target.value); // Update the local state
                }}
     
              style={{ display: 'block', width: '100%', padding: '.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </>
      )}
      <Button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '4px', border: 'none', backgroundColor: '#0056b3', color: 'white', cursor: 'pointer' }} disabled={isUploading}>
        {isUploading ? <Loader/> : "Upload"}
      </Button>
    </form>
    </Form>
  );
}
