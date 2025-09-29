import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chatbot from "./pages/Chatbot";
import SoilDataInput from "./pages/SoilDataInput";
import HomeDashboard from "./pages/HomeDashboard";
import SimpleDashboard from "./pages/SimpleDashboard";
import SoilHealth from "./pages/SoilHealth";
import CropMonitoring from "./pages/CropMonitoring";
import PestAlerts from "./pages/PestAlerts";
import Reports from "./pages/Reports";
import EvaluationResults from "./pages/EvaluationResults";
import NotFound from "./pages/NotFound";
import { FloatingChatButton } from "./components/FloatingChatButton";
import { ChatSidebarProvider } from "./components/GlobalChatSidebar";
import { PageTransition } from "./components/PageTransition";
import AppSidebar from "./components/AppSidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import ContactUs from "./pages/ContactUs";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PageTransition>
          <Index />
        </PageTransition>
      } />
      <Route path="/chatbot" element={
        <PageTransition>
          <Chatbot />
        </PageTransition>
      } />
      <Route path="/soil-data" element={
        <PageTransition>
          <SoilDataInput />
        </PageTransition>
      } />
      <Route path="/evaluation-results" element={
        <PageTransition>
          <EvaluationResults />
        </PageTransition>
      } />
      <Route path="/contactus" element={
        <PageTransition>
          <ContactUs />
        </PageTransition>
      } />
      {/* Dashboard Routes with Sidebar */}
      <Route path="/dashboard" element={
        <AppSidebar>
          <PageTransition>
            <SimpleDashboard />
          </PageTransition>
        </AppSidebar>
      } />
      <Route path="/dashboard/soil-health" element={
        <AppSidebar>
          <PageTransition>
            <SoilHealth />
          </PageTransition>
        </AppSidebar>
      } />
      <Route path="/dashboard/crop-monitoring" element={
        <AppSidebar>
          <PageTransition>
            <CropMonitoring />
          </PageTransition>
        </AppSidebar>
      } />
      <Route path="/dashboard/pest-alerts" element={
        <AppSidebar>
          <PageTransition>
            <PestAlerts />
          </PageTransition>
        </AppSidebar>
      } />
      <Route path="/dashboard/reports" element={
        <AppSidebar>
          <PageTransition>
            <Reports />
          </PageTransition>
        </AppSidebar>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={
        <PageTransition>
          <NotFound />
        </PageTransition>
      } />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <ChatSidebarProvider>
        <TooltipProvider>
          <div className="relative min-h-screen">
            <Toaster />
            <Sonner />
            <AppRoutes />
            <FloatingChatButton />
          </div>
        </TooltipProvider>
      </ChatSidebarProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;