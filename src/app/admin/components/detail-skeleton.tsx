import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailSkeleton() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-[180px]" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {/* Name */}
          <div className="flex items-start space-x-4">
            <Skeleton className="h-5 w-5 mt-0.5" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-5 w-[200px]" />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-4">
            <Skeleton className="h-5 w-5 mt-0.5" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-5 w-[180px]" />
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start space-x-4">
            <Skeleton className="h-5 w-5 mt-0.5" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-[70px]" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>

          {/* Country Code and Phone */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-5 w-5 mt-0.5" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-5 w-[80px]" />
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Skeleton className="h-5 w-5 mt-0.5" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-[90px]" />
                <Skeleton className="h-5 w-[120px]" />
              </div>
            </div>
          </div>

          {/* Vendor Code */}
          <div className="flex items-start space-x-4">
            <Skeleton className="h-5 w-5 mt-0.5" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-[90px]" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </CardContent>
    </Card>
  );
}
