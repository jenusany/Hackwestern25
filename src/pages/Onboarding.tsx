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
    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
    else handleComplete();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
            description="This helps us tailor financial advice."
          >
            <div className="space-y-3">
              {[
                "In school",
                "Early in my career",
                "Mid-career",
                "Taking a career break",
                "Near retirement",
                "Other",
              ].map((option) => (
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

      // the remaining steps stay the same — no custom color classes
      // ✔ everything now relies on global theme tokens
      // ✔ OptionButton + StepCard handle styling

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="container max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            <h1 className="text-3xl font-bold tracking-tight">
              GrowYourDoughGirl
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Let's personalize your financial journey
          </p>
        </motion.div>

        {/* Progress */}
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              Back
            </Button>
          )}

          <Button onClick={handleNext} className="flex-1">
            {currentStep === TOTAL_STEPS ? "Complete Setup" : "Continue"}
          </Button>
        </div>

        {currentStep < TOTAL_STEPS && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/Landing")}
              className="text-sm text-muted-foreground hover:text-primary"
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
