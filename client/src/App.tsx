import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ProfilePage from "@/pages/profile";
import MessagesPage from "@/pages/messages";
import ExplorePage from "@/pages/explore";
import NotificationsPage from "@/pages/notifications";
import GroupsPage from "@/pages/groups";
import SavedPage from "@/pages/saved";
import SettingsPage from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile/:userId?" component={({ params }) => <ProfilePage userId={params.userId} />} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/explore" component={ExplorePage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/groups" component={GroupsPage} />
      <Route path="/saved" component={SavedPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
