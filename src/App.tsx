import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Lab from "./pages/Lab";
import ComponentDetail from "./pages/lab/ComponentDetail";
import Hive from "./pages/Hive";
import Academy from "./pages/Academy";
import CoursePage from "./pages/academy/CoursePage";
import LessonPage from "./pages/academy/LessonPage";
import Core from "./pages/Core";
import Depot from "./pages/Depot";
import Workshop from "./pages/Workshop";
import Settings from "./pages/Settings";
import Grid from "./pages/Grid";
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
import TraceWidth from "./pages/toolbox/TraceWidth";
import PowerCalc from "./pages/toolbox/PowerCalc";
import CapacitorCode from "./pages/toolbox/CapacitorCode";
import DecibelCalc from "./pages/toolbox/DecibelCalc";
import FrequencyCalc from "./pages/toolbox/FrequencyCalc";
import MountingHoles from "./pages/forge/MountingHoles";
import WireGaugeCalc from "./pages/forge/WireGaugeCalc";
import HeatsinkCalc from "./pages/forge/HeatsinkCalc";
import FastenerCalc from "./pages/forge/FastenerCalc";
import ConnectorMatcher from "./pages/forge/ConnectorMatcher";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/lab" element={<Lab />} />
                <Route path="/lab/component/:id" element={<ComponentDetail />} />
                <Route path="/hive" element={<Hive />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="/academy/course/:id" element={<CoursePage />} />
                <Route path="/academy/lesson/:id" element={<LessonPage />} />
                <Route path="/core" element={<Core />} />
                <Route path="/depot" element={<Depot />} />
                <Route path="/workshop" element={<Workshop />} />
                <Route path="/workshop/resistor" element={<ResistorCalculator />} />
                <Route path="/workshop/ohms-law" element={<OhmsLaw />} />
                <Route path="/workshop/voltage-divider" element={<VoltageDivider />} />
                <Route path="/workshop/led-resistor" element={<LEDResistor />} />
                <Route path="/workshop/battery-life" element={<BatteryLife />} />
                <Route path="/workshop/555-timer" element={<Timer555 />} />
                <Route path="/workshop/base-converter" element={<BaseConverter />} />
                <Route path="/workshop/ascii-table" element={<AsciiTable />} />
                <Route path="/workshop/unit-converter" element={<UnitConverter />} />
                <Route path="/workshop/regex-tester" element={<RegexTester />} />
                <Route path="/workshop/trace-width" element={<TraceWidth />} />
                <Route path="/workshop/power-calc" element={<PowerCalc />} />
                <Route path="/workshop/capacitor-code" element={<CapacitorCode />} />
                <Route path="/workshop/decibel-calc" element={<DecibelCalc />} />
                <Route path="/workshop/frequency-calc" element={<FrequencyCalc />} />
                <Route path="/workshop/mounting-holes" element={<MountingHoles />} />
                <Route path="/workshop/wire-gauge" element={<WireGaugeCalc />} />
                <Route path="/workshop/heatsink" element={<HeatsinkCalc />} />
                <Route path="/workshop/fastener" element={<FastenerCalc />} />
                <Route path="/workshop/connectors" element={<ConnectorMatcher />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/grid" element={<Grid />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
