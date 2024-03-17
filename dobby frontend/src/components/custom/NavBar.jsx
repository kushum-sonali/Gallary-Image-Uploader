import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { GalleryThumbnails, LogOut, Upload } from "lucide-react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { logout } from "@/store/userSlice"
import { useDispatch } from "react-redux"

export default function NavBar() {
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 justify-between">
            <Link className="mr-6" to={"/"}>
                <GalleryThumbnails className="h-6 w-6 text-white" />
                <span className="sr-only">Image Gallery</span>
            </Link>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="md:hidden" size="icon" variant="outline">
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <Link className="mr-6 hidden md:flex" to={"/"}>
                        <GalleryThumbnails className="h-6 w-6" />
                        <span className="sr-only">Image Gallery</span>
                    </Link>
                    <div className="grid gap-2 py-6">
                        <Link className="flex w-full items-center py-2 text-lg font-semibold gap-2" to={"/upload-image"}>
                            Upload
                            <Upload className="h-6 w-6" />
                        </Link>
                        {user && (
                            <>
                                <Link className="flex w-full items-center py-2 text-lg font-semibold gap-2" to={`/gallary/${user.uid}`}>
                                    My Gallary
                                </Link>
                                <div className="flex w-full items-center py-2 text-lg font-semibold gap-2" onClick={handleLogout}>
                                    Logout
                                    <LogOut className="h-6 w-6" />
                                </div>
                            </>
                        )}
                        {!user && (
                            <Link className="flex w-full items-center py-2 text-lg font-semibold" to={"/login"}>
                                Login
                            </Link>
                        )}

                    </div>
                </SheetContent>
            </Sheet>
            <nav className="ml-auto hidden md:flex gap-6">
                <Link
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    to={"/upload-image"}
                >
                    Upload
                </Link>
                {user && (
                    <>
                        <Link
                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                            to={`/gallary/${user.uid}`}
                        >
                            My Gallary
                        </Link>
                        <div className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50 cursor-pointer gap-2" onClick={handleLogout}>
                            Logout
                            <LogOut className="h-6 w-6" />
                        </div>
                    </>
                )}
                {!user && (
                    <Link
                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                        to={"/login"}
                    >
                        Login
                    </Link>
                )}
            </nav>
        </header>
    )
}

function MenuIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}


