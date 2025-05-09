
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportProblem from "./pages/ReportProblem";
import MyReports from "./pages/MyReports";
import ReportDetail from "./pages/ReportDetail";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import MakeAdmin from "./pages/MakeAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/report-problem" element={
              <ProtectedRoute>
                <ReportProblem />
              </ProtectedRoute>
            } />
            <Route path="/my-reports" element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            } />
            <Route path="/report/:id" element={<ReportDetail />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/make-admin" element={<MakeAdmin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
