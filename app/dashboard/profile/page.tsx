"use client"

import { useState } from "react"
import { Camera } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const [role, setRole] = useState("farmer")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">User Profile</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Upload avatar</span>
                </Button>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">John Doe</h3>
                <p className="text-sm text-muted-foreground">Joined June 2023</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+91 9876543210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              {/* TODO: Connect to backend/userAuth.js to update user profile */}
              {/* 1. Collect form data */}
              {/* 2. Send update request to the backend API */}
              {/* 3. Show success/error message */}
              Update Profile
            </Button>
          </CardFooter>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Change Password</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your notification and display preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notifications">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="display">Display</TabsTrigger>
                </TabsList>
                <TabsContent value="notifications" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sms-notifications"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="contract-updates"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <Label htmlFor="contract-updates">Contract Updates</Label>
                  </div>
                </TabsContent>
                <TabsContent value="display" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="compact-view" className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor="compact-view">Compact View</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-analytics"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <Label htmlFor="show-analytics">Show Analytics</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

