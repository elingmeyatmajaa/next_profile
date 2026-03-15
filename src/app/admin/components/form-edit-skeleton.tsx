import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FormEditSkeleton() {
  return (
    <Card className="max-w-full mx-auto animate-in fade-in-50">
      <CardHeader className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[350px]" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[50px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Address field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[70px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Country Code and Phone Number fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[110px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Vendor Code field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[90px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </CardContent>
    </Card>
  );
}
