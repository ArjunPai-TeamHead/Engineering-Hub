import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Lab from "./pages/Lab";
import Hive from "./pages/Hive";
import Academy from "./pages/Academy";
import Core from "./pages/Core";
import Toolbox from "./pages/Toolbox";
import ResistorCalculator from "./pages/toolbox/ResistorCalculator";
import OhmsLaw from "./pages/toolbox/OhmsLaw";
import VoltageDivider from "./pages/toolbox/VoltageDivider";
import LEDResistor from "./pages/toolbox/LEDResistor";
import BatteryLife from "./pages/toolbox/BatteryLife";
import Timer555 from "./pages/toolbox/Timer555";
import BaseConverter from "./pages/toolbox/BaseConverter";
import AsciiTable from "./pages/toolbox/AsciiTable";
import UnitConverter from "./pages/toolbox/UnitConverter";
import RegexTester from "./pages/toolbox/RegexTester";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/hive" element={<Hive />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/core" element={<Core />} />
              <Route path="/toolbox" element={<Toolbox />} />
              <Route path="/toolbox/resistor" element={<ResistorCalculator />} />
              <Route path="/toolbox/ohms-law" element={<OhmsLaw />} />
              <Route path="/toolbox/voltage-divider" element={<VoltageDivider />} />
              <Route path="/toolbox/led-resistor" element={<LEDResistor />} />
              <Route path="/toolbox/battery-life" element={<BatteryLife />} />
              <Route path="/toolbox/555-timer" element={<Timer555 />} />
              <Route path="/toolbox/base-converter" element={<BaseConverter />} />
              <Route path="/toolbox/ascii-table" element={<AsciiTable />} />
              <Route path="/toolbox/unit-converter" element={<UnitConverter />} />
              <Route path="/toolbox/regex-tester" element={<RegexTester />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
