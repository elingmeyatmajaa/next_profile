import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-black">📊 Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-black">Total pengguna: 120</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-black">⚙️ Pengaturan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-black">Kelola data user, role, dan izin</p>
        </CardContent>
      </Card>
    </div>
  );
}
