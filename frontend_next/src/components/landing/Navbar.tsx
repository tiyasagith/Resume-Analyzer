// import { Button } from "@/components/ui/button";
// import { FileText, LogOut, User } from "lucide-react";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect, useState } from "react";
// import { useGetCookie } from "@/hooks/useGetCookie";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// const Navbar = () => {
//   const { isAuthenticated, logout } = useAuth();

//   // Example usage: const myCookie = useGetCookie("your_cookie_key");

//   const userName = useGetCookie("userName");
//   const profileImage = useGetCookie("profileImage");
//   const email = useGetCookie("email");

//   const [userData, setuserData] = useState({
//     userName: "",
//     profileImage: "",
//     email: "",
//   })

//   useEffect(() => {
//     if (typeof window !== undefined) {
//       setuserData({
//         userName: userName || "",
//         profileImage: profileImage || "",
//         email: email || "",
//       })
//     }
//   }, [userName, profileImage, email])

//   // const userData = {
//   //   userName: userName || "",
//   //   profileImage: profileImage || "",
//   //   email: email || "",
//   // };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
//       <div className="container flex items-center justify-between h-16 px-4">
//         <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl text-foreground">
//           <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
//             <FileText className="w-4 h-4 text-primary-foreground" />
//           </div>
//           ResumeAI
//         </Link>
//         <div className="flex items-center gap-3">
//           {isAuthenticated ? (
//             <div className="flex items-center gap-4">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//                     <Avatar className="h-10 w-10">
//                       <AvatarImage src={userData?.profileImage || ""} alt={userData?.userName || "User"} />
//                       <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
//                         {userData?.userName?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
//                       </AvatarFallback>
//                     </Avatar>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-56" align="end" forceMount>
//                   <DropdownMenuLabel className="font-normal">
//                     <div className="flex flex-col space-y-1">
//                       <p className="text-sm font-medium leading-none">{userData?.userName || "User"}</p>
//                       {userData?.email && (
//                         <p className="text-xs leading-none text-muted-foreground">
//                           {userData.email}
//                         </p>
//                       )}
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 cursor-pointer">
//                     <LogOut className="mr-2 h-4 w-4" />
//                     <span>Log out</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           ) : (
//             <>
//               <Link href="/login">
//                 <Button variant="ghost" size="sm">Log In</Button>
//               </Link>
//               <Link href="/signup">
//                 <Button variant="hero" size="sm" className="px-5">Sign Up</Button>
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


"use client";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useGetCookie } from "@/hooks/useGetCookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userName = useGetCookie("userName");
  const profileImage = useGetCookie("profileImage");
  const email = useGetCookie("email");

  const [userData, setUserData] = useState({
    userName: "",
    profileImage: "",
    email: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserData({
        userName: userName || "",
        profileImage: profileImage || "",
        email: email || "",
      });
    }
  }, [userName, profileImage, email]);

  // Add scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50 transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-none"
          }`}
      >
        <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-heading font-bold text-xl text-foreground shrink-0"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span>ResumeAI</span>
          </Link>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={userData?.profileImage || ""}
                        alt={userData?.userName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {userData?.userName?.charAt(0).toUpperCase() || (
                          <User className="w-5 h-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.userName || "User"}
                      </p>
                      {userData?.email && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {userData.email}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="hero" size="sm" className="px-5">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: avatar or hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={userData?.profileImage || ""}
                        alt={userData?.userName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-sm">
                        {userData?.userName?.charAt(0).toUpperCase() || (
                          <User className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.userName || "User"}
                      </p>
                      {userData?.email && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {userData.email}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2 rounded-md text-foreground hover:bg-accent transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu (unauthenticated only) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen && !isAuthenticated
              ? "max-h-40 opacity-100"
              : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex flex-col gap-2 px-4 pb-4 pt-2 border-t border-border/40 bg-background/80 backdrop-blur-xl">
            <Link href="/login" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-center">
                Log In
              </Button>
            </Link>
            <Link href="/signup" onClick={closeMobileMenu}>
              <Button variant="hero" size="sm" className="w-full justify-center">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
