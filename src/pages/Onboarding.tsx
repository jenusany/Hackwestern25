import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProgressBar from "@/components/onboarding/ProgressBar";
import StepCard from "@/components/onboarding/StepCard";
import OptionButton from "@/components/onboarding/OptionButton";
import { OnboardingData } from "@/types/onboarding";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const TOTAL_STEPS = 11;

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    milestones: [],
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelect = (field: keyof OnboardingData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMultiSelect = (value: string) => {
    const current = formData.milestones || [];
    const updated = current.includes(value)
      ? current.filter((m) => m !== value)
      : [...current, value];
    setFormData({ ...formData, milestones: updated });
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      const completeData: OnboardingData = {
        ...(formData as OnboardingData),
        completedAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "User",
        onboardingCompleted: true,
        onboardingData: completeData,
        createdAt: new Date(),
      });

      toast.success("Profile setup complete!");
      navigate("/Landing");
    } catch (error) {
      toast.error("Failed to save profile");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepCard 
            title="Let's start with your name" 
            description="We'll use this to personalize your experience."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName || ""}
                  onChange={(e) => handleSelect("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName || ""}
                  onChange={(e) => handleSelect("lastName", e.target.value)}
                />
              </div>
            </div>
          </StepCard>
        );

      case 2:
        return (
          <StepCard 
            title="What's your current life stage?" 
            description="This helps us tailor financial advice to where you are right now."
          >
            <div className="space-y-3">
              {["In school", "Early in my career", "Mid-career", "Taking a career break", "Near retirement", "Other"].map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={formData.lifeStage === option}
                  onClick={() => handleSelect("lifeStage", option)}
                />
              ))}
            </div>
          </StepCard>
        );

      case 3:
        return (
          <StepCard 
            title="Are you planning to buy a home?"
            description="Home ownership is a major financial milestone we can help you prepare for."
          >
            <div className="space-y-3">
              {[
                "Yes, within 3 years",
                "Yes, within 3–7 years",
                "Yes, someday but not sure when",
                "No",
                "Already own a home"
              ].map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={formData.housingMilestone === option}
                  onClick={() => handleSelect("housingMilestone", option)}
                />
              ))}
            </div>
          </StepCard>
        );

      case 4:
        return (
          <StepCard 
            title="Are you planning to have children?"
            description="Family planning has significant financial implications we can help you navigate."
          >
            <div className="space-y-3">
              {[
                "Yes, within 1–3 years",
                "Yes, someday",
                "Not planning",
                "I already have children"
              ].map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={formData.planningChildren === option}
                  onClick={() => handleSelect("planningChildren", option)}
                />
              ))}
            </div>
          </StepCard>
        );

      case 5:
        return (
          <StepCard 
            title="Do you support parents or family financially?"
            description="Caregiving responsibilities affect your financial planning needs."
          >
            <div className="space-y-3">
              {[
                "Yes, currently",
                "Yes, in the future",
                "No / not sure"
              ].map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={formData.supportFamily === option}
                  onClick={() => handleSelect("supportFamily", option)}
                />
              ))}
            </div>
          </StepCard>
        );

      case 6:
        return (
          <StepCard 
            title="How stable is your income?"
            description="Understanding your income stability helps us plan for financial security."
          >
            <div className="space-y-3">
              {[
                "Very stable",
                "Somewhat stable",
                "Unstable/variable",
                "Prefer not to say"
              ].map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={formData.incomeStability === option}
                  onClick={() => handleSelect("incomeStability", option)}
                />
              ))}
            </div>
          </StepCard>
        );

      case 7:
        return (
          <StepCard 
            title="Do you anticipate a job change soon?"
            description="Career transitions are important to factor into your financial plan."
          >
            <div className="space-y-3">
              {["Yes", "Maybe", "No"].map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={formData.jobChange === option}
                  onClick={() => handleSelect("jobChange", option)}
                />
              ))}
            </div>
          </StepCard>
        );

      case 8:
        return (
          <StepCard 
            title="Do you have emergency savings?"
            description="Emergency funds are the foundation of financial security."
          >
            <div className="space-y-3">
              {[
                "Yes, fully built",
                "Yes, partially built",
                "No",
                "Not sure what that is"
              ].map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={formData.emergencySavings === option}
                  onClick={() => handleSelect("emergencySavings", option)}
                />
              ))}
            </div>
          </StepCard>
        );

      case 9:
        return (
          <StepCard 
            title="What are your most important milestones?"
            description="Select all that apply - we'll help you prioritize and plan for each one."
          >
            <div className="space-y-3">
              {[
                "Paying off debt",
                "Building savings",
                "Buying a home",
                "Starting a family",
                "Advancing my career",
                "Supporting family",
                "Travel / lifestyle",
                "Starting a business",
                "Preparing for retirement",
                "Not sure yet"
              ].map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={(formData.milestones || []).includes(option)}
                  onClick={() => handleMultiSelect(option)}
                />
              ))}
            </div>
          </StepCard>
        );

      case 10:
        return (
          <StepCard 
            title="How comfortable are you with investing?"
            description="Your comfort level helps us recommend the right investment approach."
          >
            <div className="space-y-3 mb-6">
              {[
                "Very confident",
                "Somewhat confident",
                "A little nervous",
                "Very uncomfortable",
                "Never invested"
              ].map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={formData.investmentComfort === option}
                  onClick={() => handleSelect("investmentComfort", option)}
                />
              ))}
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium mb-3 text-foreground">
                How would you react if your portfolio dropped 20%?
              </p>
              <div className="space-y-3">
                {[
                  "Totally fine",
                  "Slightly anxious but okay",
                  "Very anxious",
                  "I'd want to withdraw immediately"
                ].map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={formData.portfolioReaction === option}
                    onClick={() => handleSelect("portfolioReaction", option)}
                  />
                ))}
              </div>
            </div>
          </StepCard>
        );

      case 11:
        return (
          <StepCard 
            title="Let's finalize your financial profile"
            description="Just a few more questions to personalize your experience."
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-3 text-foreground">
                  When do you need money you invest?
                </p>
                <div className="space-y-3">
                  {[
                    "Within 1 year",
                    "1–3 years",
                    "3–7 years",
                    "7+ years",
                    "Not sure"
                  ].map((option) => (
                    <OptionButton
                      key={option}
                      label={option}
                      selected={formData.investmentHorizon === option}
                      onClick={() => handleSelect("investmentHorizon", option)}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-3 text-foreground">
                  How much could you invest monthly?
                </p>
                <div className="space-y-3">
                  {[
                    "< $25",
                    "$25–$50",
                    "$50–$100",
                    "$100–$250",
                    "$250+",
                    "Not sure"
                  ].map((option) => (
                    <OptionButton
                      key={option}
                      label={option}
                      selected={formData.monthlyInvestment === option}
                      onClick={() => handleSelect("monthlyInvestment", option)}
                    />
                  ))}
                </div>
              </div>

            </div>
          </StepCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-pink-100 py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            <h1 className="text-3xl font-extrabold text-purple-700 tracking-wide">EmpowerFinance</h1>
          </div>
          <p className="text-pink-400 font-medium">Let's personalize your financial journey</p>
        </motion.div>

        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {renderStep()}

        <div className="flex gap-4 mt-6">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 bg-white text-purple-600 border border-purple-200"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-pink-400 hover:bg-pink-500 text-white font-bold rounded-xl"
          >
            {currentStep === TOTAL_STEPS ? "Complete Setup" : "Continue"}
          </Button>
        </div>

        {currentStep < TOTAL_STEPS && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/Landing")}
              className="text-sm text-purple-400 hover:text-pink-500"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
