import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserProfile } from "@/types/onboarding";
import {
  Sparkles,
  LogOut,
  Settings,
  TrendingUp,
  Target,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const loadProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // No profile yet, redirect to onboarding
          navigate("/onboarding");
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    setShowLogoutDialog(false);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const firstName =
    profile?.onboardingData?.firstName ||
    profile?.displayName?.split(" ")[0] ||
    "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo section */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">
                  GrowYourDoughGirl
                </h1>
              </div>

              {/* Icons + Home + Settings + Logout */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="hidden sm:inline-flex"
                >
                  Home
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>


      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {firstName}! 👋
          </h2>
          <p className="text-lg text-muted-foreground">
            Here's your financial life-stage summary
          </p>
        </motion.div>

        {!profile?.onboardingCompleted ? (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Let's personalize your financial planning experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/onboarding")}
                className="bg-primary hover:bg-primary/90"
              >
                Start Onboarding
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Life Stage Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Your Life Stage</CardTitle>
                  <CardDescription>Current focus area</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-foreground">
                    {profile?.onboardingData?.lifeStage || "Not set"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Your Milestones</CardTitle>
                  <CardDescription>What you're working toward</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {profile?.onboardingData?.milestones
                      ?.slice(0, 3)
                      .map((milestone) => (
                        <li key={milestone} className="text-sm text-foreground">
                          • {milestone}
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Investment Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="bg-secondary/50 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Investment Comfort</CardTitle>
                  <CardDescription>Your risk profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-foreground">
                    {profile?.onboardingData?.investmentComfort || "Not set"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Budget Tracker - Mock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Budget Overview</CardTitle>
                  <CardDescription>Track your income and expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                      <span className="text-sm font-medium">Income</span>
                      <span className="text-lg font-bold text-primary">
                        Coming soon
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                      <span className="text-sm font-medium">Expenses</span>
                      <span className="text-lg font-bold">Coming soon</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-primary/10 rounded-xl">
                      <span className="text-sm font-medium">
                        Available to Save
                      </span>
                      <span className="text-lg font-bold text-primary">
                        Coming soon
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals Tracker - Mock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Goal Progress</CardTitle>
                  <CardDescription>Your financial milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-xl">
                      <p className="text-sm font-medium mb-2">Emergency Fund</p>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-0" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coming soon
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-xl">
                      <p className="text-sm font-medium mb-2">
                        Home Down Payment
                      </p>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-0" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </main>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
