export interface OnboardingData {
  firstName: string;
  lastName: string;
  lifeStage: string;
  housingMilestone: string;
  planningChildren: string;
  supportFamily: string;
  incomeStability: string;
  jobChange: string;
  emergencySavings: string;
  milestones: string[];
  investmentComfort: string;
  portfolioReaction: string;
  investmentHorizon: string;
  monthlyInvestment: string;
  lifestyleValues: string;
  completedAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  onboardingCompleted: boolean;
  onboardingData?: OnboardingData;
  createdAt: Date;
}
