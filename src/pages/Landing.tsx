import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Heart, Shield } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">EmpowerFinance</h1>
        </motion.div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/auth")}
          className="border-primary/50 hover:bg-primary/10"
        >
          Log In
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Financial Planning<br />
              <span className="text-primary">for Every Life Stage</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Designed specifically for women navigating career, family, and financial goals. 
              Get personalized guidance that understands your unique journey.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth?signup=true")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Life-Stage Planning</h3>
              <p className="text-muted-foreground">
                From early career to retirement, get guidance tailored to where you are right now.
              </p>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Smart Goal Setting</h3>
              <p className="text-muted-foreground">
                Track milestones like buying a home, family planning, or career advancement.
              </p>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your financial information is protected with bank-level security.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
