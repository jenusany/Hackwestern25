// src/pages/Landing.tsx
// Added slower, smoother hover grow-in animation for timeline items
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Home,
  PiggyBank,
  Shield,
  LineChart,
  Baby,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/onboarding";
import AdvisorChat from "@/components/AdvisorChat";

type PortfolioKey = "emergencyFund" | "tfsa" | "fhsa" | "rrsp" | "maternity";

interface TimelineItem {
  key: PortfolioKey;
  label: string;
  icon: React.ReactNode;
  summary: string;
  blurb: string;
}

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          if (!data.onboardingCompleted) {
            navigate("/onboarding");
            return;
          }
          setProfile(data);
        } else {
          navigate("/onboarding");
        }
      } catch (e) {
        console.error("Failed to load profile for timeline:", e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user, navigate]);

  const lifeStageLabel =
    profile?.onboardingData?.lifeStage || "your current life stage";
  const milestones = profile?.onboardingData?.milestones || [];
  const housingMilestone = profile?.onboardingData?.housingMilestone;
  const planningChildren = profile?.onboardingData?.planningChildren;
  const emergencySavings = profile?.onboardingData?.emergencySavings;

  const hasRetirementFocus = milestones.includes("Preparing for retirement");
  const wantsHomeSoon =
    housingMilestone === "Yes, within 3 years" ||
    housingMilestone === "Yes, within 3–7 years";
  const wantsHomeEventually =
    housingMilestone === "Yes, someday but not sure when";
  const alreadyOwnsHome = housingMilestone === "Already own a home";

  const familyRelated =
    planningChildren === "Yes, within 1–3 years" ||
    planningChildren === "Yes, someday" ||
    planningChildren === "I already have children" ||
    milestones.includes("Starting a family");

  const emergencyBuilt =
    emergencySavings === "Yes, fully built" ||
    emergencySavings === "Yes, partially built";

  const fhsaRelevant =
    !alreadyOwnsHome && (wantsHomeSoon || wantsHomeEventually);
  const rrspRelevant =
    hasRetirementFocus ||
    profile?.onboardingData?.lifeStage === "Mid-career" ||
    profile?.onboardingData?.lifeStage === "Near retirement";
  const maternityRelevant = familyRelated;

  const timelineItemsBase: TimelineItem[] = useMemo(
    () => [
      {
        key: "emergencyFund",
        label: "Emergency Fund",
        icon: <Shield className="h-5 w-5" />,
        summary: emergencyBuilt
          ? "Your safety net supports everything else."
          : "This is usually the very first money milestone.",
        blurb: `As someone in "${lifeStageLabel}", this portfolio is important because it protects your financial stability when life throws curveballs like job changes, health costs, or surprise expenses. It helps you avoid high interest debt and keeps your long term goals on track. A common benchmark is 3 to 6 months of essential expenses.`,
      },
      {
        key: "tfsa",
        label: "Tax-Free Savings Account (TFSA)",
        icon: <PiggyBank className="h-5 w-5" />,
        summary:
          "Typically the first investing account after your emergency fund.",
        blurb: `As someone in "${lifeStageLabel}", this portfolio is important because it is usually the first place to grow your investments after your emergency fund. It lets your money grow tax free while staying flexible for both near term goals and long term wealth without losing gains to taxation.`,
      },
      {
        key: "fhsa",
        label: "First Home Savings Account (FHSA)",
        icon: <Home className="h-5 w-5" />,
        summary: "A tax advantaged way to build a first home down payment.",
        blurb: `As someone in "${lifeStageLabel}", this portfolio is important because it combines RRSP-style tax deductions with TFSA-style tax-free withdrawals when used for a first home. If homeownership is in your plans, this can shorten the time to a down payment and make each dollar work harder.`,
      },
      {
        key: "rrsp",
        label: "Registered Retirement Savings Plan (RRSP)",
        icon: <LineChart className="h-5 w-5" />,
        summary: "A long-term engine for retirement and financial independence.",
        blurb: `As someone in "${lifeStageLabel}", this portfolio is important because it supports your future self. Contributions can lower today’s taxes while investments grow tax-deferred. RRSPs are especially powerful as your income rises—even if your career includes breaks for caregiving, education, or travel.`,
      },
      {
        key: "maternity",
        label: "Maternity & Parental Leave Fund",
        icon: <Baby className="h-5 w-5" />,
        summary:
          "A buffer for income gaps and added costs during pregnancy and early parenting.",
        blurb: `As someone in "${lifeStageLabel}" who is planning for children, this portfolio is important because it provides financial breathing room during maternity or parental leave. It helps cover reduced income, childcare transitions, healthcare costs, and early parenting expenses.`,
      },
    ],
    [emergencyBuilt, lifeStageLabel]
  );

  const itemsByKey = useMemo(() => {
    const map = new Map<PortfolioKey, TimelineItem>();
    timelineItemsBase.forEach((i) => map.set(i.key, i));
    return map;
  }, [timelineItemsBase]);

  const timelineOrder: PortfolioKey[] = useMemo(() => {
    const order: PortfolioKey[] = ["emergencyFund", "tfsa"];
    let remaining: PortfolioKey[] = ["fhsa", "rrsp"];
    if (familyRelated) remaining.push("maternity");

    const relevanceScore: Record<PortfolioKey, number> = {
      emergencyFund: 0,
      tfsa: 0,
      fhsa: fhsaRelevant ? 2 : 0,
      rrsp: rrspRelevant ? 2 : 0,
      maternity: maternityRelevant ? 2 : 0,
    };

    remaining.sort((a, b) => relevanceScore[b] - relevanceScore[a]);
    order.push(...remaining);

    return order;
  }, [fhsaRelevant, rrspRelevant, maternityRelevant, familyRelated]);

  const sortedTimelineItems = timelineOrder.map((key) => itemsByKey.get(key)!);

  const firstName =
    profile?.onboardingData?.firstName ||
    profile?.displayName?.split(" ")[0] ||
    "there";

  const closeChat = () => {
    setIsChatOpen(false);
    setIsChatFullscreen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/20">
        <p className="text-muted-foreground">Loading your financial timeline...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      {/* Header */}
        <header className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            
            {/* Clickable Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                GrowYourDoughGirl
              </h1>
            </div>

            {/* Right-side Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-primary/50"
              >
                Dashboard
              </Button>

              <Button
                onClick={() => navigate("/onboarding")}
                variant="ghost"
              >
                Edit profile
              </Button>
            </div>
          </div>
        </header>


      {/* Main */}
      <main className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Hey {firstName}, here is your money timeline
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              This is the suggested order to think about your core portfolios.
              Hover over each step to see why it matters for your life stage.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative border-l border-border/40 pl-6 space-y-8">
            {sortedTimelineItems.map((item, idx) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative group"
              >
                {/* Dot */}
                <div className="absolute -left-[13px] top-4 h-6 w-6 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary transition-transform duration-500 group-hover:scale-125" />
                </div>

                {/* Card with shared variants for scale + description */}
                <motion.div
                  className="rounded-2xl bg-card shadow-sm border border-border/60 p-4 md:p-5 cursor-default transition-all duration-500 ease-in-out"
                  variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.03 },
                  }}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {idx + 1}. {item.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Hover to see why this comes here in your journey.
                      </p>
                    </div>
                  </div>

                  {/* Description that expands on hover */}
                  <motion.div
                    variants={{
                      rest: { height: 0, opacity: 0 },
                      hover: { height: "auto", opacity: 1 },
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mt-4 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-foreground mb-1">
                      {item.summary}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.blurb}
                    </p>

                    {item.key === "fhsa" && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Your housing plan:{" "}
                        <span className="font-medium">
                          {housingMilestone || "Not specified"}
                        </span>
                        .
                      </p>
                    )}

                    {item.key === "maternity" && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Your family plan:{" "}
                        <span className="font-medium">
                          {planningChildren || "Not specified"}
                        </span>
                        .
                      </p>
                    )}

                    {item.key === "emergencyFund" && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Emergency fund status:{" "}
                        <span className="font-medium">
                          {emergencySavings || "Not specified"}
                        </span>
                        .
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Toggle buttons */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex bg-muted rounded-full p-1">
              <button className="px-4 py-1 text-sm rounded-full bg-background shadow">
                Timeline view
              </button>
              <button
                onClick={() => navigate("/portfolio")}
                className="px-4 py-1 text-sm text-muted-foreground hover:bg-background/70 rounded-full"
              >
                Portfolio view
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Open money advisor chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Modal anchored bottom-right, with fullscreen toggle */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeChat}
          />

          {/* Responsive Chat Panel */}
          <div
            className={
              isChatFullscreen
                ? "relative z-50 w-full h-full mx-0 mb-0"
                : "relative z-50 w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto sm:mx-6 mb-4"
            }
          >
            <div
              className={
                isChatFullscreen
                  ? "h-full flex flex-col rounded-none sm:rounded-2xl bg-card border border-border/60 shadow-2xl overflow-hidden"
                  : "h-[85vh] sm:h-[80vh] flex flex-col rounded-2xl bg-card border border-border/60 shadow-2xl overflow-hidden"
              }
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card/90 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Money advisor chat
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsChatFullscreen((prev) => !prev)}
                    className="text-xs text-muted-foreground hover:text-foreground border border-border/60 rounded-full px-2 py-1"
                  >
                    {isChatFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  </button>
                  <button
                    onClick={closeChat}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-4 overflow-y-auto flex-1 bg-background/40">
                <AdvisorChat />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
