import { RouteOptimizerTool } from "@/components/dashboard/route-optimizer-tool";

export default function RouteOptimizerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-headline">AI Route Optimizer</h1>
        <p className="text-muted-foreground">
            Enter a starting point and multiple destinations to calculate the most efficient route, considering potential traffic and closures.
        </p>
      </div>
      <RouteOptimizerTool />
    </div>
  );
}
