import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AdminRoute } from "@/components/AdminRoute";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Hub = lazy(() => import("./pages/Hub"));
const Lab = lazy(() => import("./pages/Lab"));
const ComponentDetail = lazy(() => import("./pages/lab/ComponentDetail"));
const Hive = lazy(() => import("./pages/Hive"));
const Academy = lazy(() => import("./pages/Academy"));
const CoursePage = lazy(() => import("./pages/academy/CoursePage"));
const LessonPage = lazy(() => import("./pages/academy/LessonPage"));
const Certificates = lazy(() => import("./pages/Certificates"));
const Core = lazy(() => import("./pages/Core"));
const Depot = lazy(() => import("./pages/Depot"));
const Workshop = lazy(() => import("./pages/Workshop"));
const Settings = lazy(() => import("./pages/Settings"));
const CloudDatabase = lazy(() => import("./pages/CloudDatabase"));
const ResistorCalculator = lazy(() => import("./pages/toolbox/ResistorCalculator"));
const OhmsLaw = lazy(() => import("./pages/toolbox/OhmsLaw"));
const VoltageDivider = lazy(() => import("./pages/toolbox/VoltageDivider"));
const LEDResistor = lazy(() => import("./pages/toolbox/LEDResistor"));
const BatteryLife = lazy(() => import("./pages/toolbox/BatteryLife"));
const Timer555 = lazy(() => import("./pages/toolbox/Timer555"));
const BaseConverter = lazy(() => import("./pages/toolbox/BaseConverter"));
const AsciiTable = lazy(() => import("./pages/toolbox/AsciiTable"));
const UnitConverter = lazy(() => import("./pages/toolbox/UnitConverter"));
const RegexTester = lazy(() => import("./pages/toolbox/RegexTester"));
const TraceWidth = lazy(() => import("./pages/toolbox/TraceWidth"));
const PowerCalc = lazy(() => import("./pages/toolbox/PowerCalc"));
const CapacitorCode = lazy(() => import("./pages/toolbox/CapacitorCode"));
const DecibelCalc = lazy(() => import("./pages/toolbox/DecibelCalc"));
const FrequencyCalc = lazy(() => import("./pages/toolbox/FrequencyCalc"));
const MountingHoles = lazy(() => import("./pages/forge/MountingHoles"));
const WireGaugeCalc = lazy(() => import("./pages/forge/WireGaugeCalc"));
const HeatsinkCalc = lazy(() => import("./pages/forge/HeatsinkCalc"));
const FastenerCalc = lazy(() => import("./pages/forge/FastenerCalc"));
const ConnectorMatcher = lazy(() => import("./pages/forge/ConnectorMatcher"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={null}>
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
                  <Route path="/certificates" element={<Certificates />} />
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
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/hub" element={<Hub />} />
                  <Route path="/cloud" element={<CloudDatabase />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
