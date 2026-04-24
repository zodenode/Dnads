import { GrowthReportPage } from "@/components/report/growth-report-page";
import { demoGrowthReport } from "@/lib/report-demo-data";

export default function Home() {
  return <GrowthReportPage report={demoGrowthReport} />;
}
