"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>FM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Farm Fresh Co.</p>
          <p className="text-sm text-muted-foreground">Contract #1234</p>
        </div>
        <div className="ml-auto font-medium">+₹1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>AG</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Agro Supplies Ltd.</p>
          <p className="text-sm text-muted-foreground">Contract #1235</p>
        </div>
        <div className="ml-auto font-medium">+₹3,500.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>GF</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Green Fields Inc.</p>
          <p className="text-sm text-muted-foreground">Contract #1236</p>
        </div>
        <div className="ml-auto font-medium">+₹2,750.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>HF</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Harvest Foods</p>
          <p className="text-sm text-muted-foreground">Contract #1237</p>
        </div>
        <div className="ml-auto font-medium">+₹4,200.00</div>
      </div>
    </div>
  )
}

