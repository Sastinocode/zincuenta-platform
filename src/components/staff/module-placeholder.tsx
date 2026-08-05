import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
