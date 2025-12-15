
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileText } from "lucide-react";

// Mock data, to be replaced with real data from user profile
const documents = [
    { type: 'National Registration Card (NRC)', status: 'Approved', file: 'nrc_bwalya.pdf' },
    { type: 'Driver\'s License', status: 'Pending', file: null },
    { type: 'Proof of Address', status: 'Rejected', file: null, reason: 'Document is blurry' },
];

export function DocumentManagement() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Document Management</CardTitle>
        <CardDescription>
          Upload and manage your verification documents. All uploads are
          secure and confidential.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    {doc.type}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      doc.status === "Approved"
                        ? "secondary"
                        : doc.status === "Rejected"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {doc.status}
                  </Badge>
                   {doc.status === 'Rejected' && doc.reason && (
                    <p className="text-xs text-destructive mt-1">{doc.reason}</p>
                   )}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                        <Label htmlFor={`upload-${index}`} className="sr-only">Upload</Label>
                        <Input id={`upload-${index}`} type="file" className="text-sm max-w-xs file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground hover:file:bg-primary/90" />
                        <Button size="sm">
                            <UploadCloud className="mr-2 h-4 w-4" /> Upload
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
