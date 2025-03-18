import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      <div className="fixed inset-y-0 left-0 hidden w-1/2 bg-muted lg:block">
        <Image
          src="https://nuvra.cloud/wp-content/uploads/2025/02/4848.jpg"
          alt="Nuvra Cloud"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-black/25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="https://nuvra.cloud/wp-content/uploads/2025/02/Camada-12-ss.png"
            alt="Logo Nuvra Cloud"
            width={300}
            height={300}
            className="z-10"
            priority
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium p-6 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Nuvra Cloud
        </div>
      </div>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center lg:col-start-2">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-8 py-12 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
} 