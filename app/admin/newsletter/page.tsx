"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewsletterSubscribers } from "@/components/dashboard/newsletter-subscribers"
import { RichTextEditor } from "@/components/dashboard/rich-text-editor"

export default function NewsletterPage() {
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Compose Newsletter</CardTitle>
              <CardDescription>Create and send emails to your subscribers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="border rounded-md h-[500px]">
                  <RichTextEditor value={content} onChange={setContent} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="rounded-md border p-4 space-y-3">
                  {subject || content ? (
                    <>
                      {subject && (
                        <div className="border-b pb-2">
                          <h3 className="text-lg font-medium">{subject}</h3>
                        </div>
                      )}
                      <div className="text-sm">
                        {content ? (
                          <div dangerouslySetInnerHTML={{ __html: content }} />
                        ) : (
                          <span className="text-muted-foreground italic">No content yet...</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Preview will appear here as you type...</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className={`${subject && content ? 'bg-green-300' : 'bg-white'}`} disabled={!subject || !content}>Send Newsletter</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
              <CardDescription>Manage your newsletter subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterSubscribers />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

