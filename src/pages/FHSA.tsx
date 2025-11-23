// src/pages/FHSA.tsx
import { DollarSign, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FHSA = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      {/* Header */}
      <header className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <DollarSign className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              GrowYourDoughGirl
            </h1>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/Landing")}>
              Landing
            </Button>
            <Button variant="ghost" onClick={() => navigate("/onboarding")}>
              Edit profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                First Home Savings Account (FHSA)
              </h2>
              <p className="text-muted-foreground text-sm">
                A powerful tool for building your first home down payment.
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        {/* What it is */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            What is an FHSA?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A First Home Savings Account (FHSA) is a registered account designed
            specifically to help you save for your first home. It combines some
            of the best features of an RRSP and a TFSA: contributions can be
            tax deductible in many cases, and qualifying withdrawals for a first
            home purchase can be tax free.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            The government sets annual and lifetime contribution limits for the
            FHSA. When the money is used for a qualifying first home purchase,
            the growth and withdrawals can be tax free. If you don’t end up
            buying a home, there are typically ways to transfer funds to an RRSP
            without immediate tax, subject to the rules that apply at that time.
          </p>
        </section>

        {/* Why it's important */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            Why is the FHSA important?
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium">Boosted tax advantages:</span> You
              may get an upfront tax deduction similar to RRSP contributions,
              while still enjoying tax free withdrawals for a first home.
            </li>
            <li>
              <span className="font-medium">Faster down payment growth:</span>{" "}
              Tax free investment growth can potentially help your savings keep
              up with rising home prices better than a regular savings account.
            </li>
            <li>
              <span className="font-medium">Goal-specific account:</span> The
              FHSA keeps your home down payment separate from other savings so
              it doesn’t accidentally get spent on random life chaos.
            </li>
            <li>
              <span className="font-medium">Flexible long term use:</span> If
              your plans change, there may be ways to redirect funds to
              retirement instead of losing the benefit entirely.
            </li>
          </ul>
        </section>

        {/* How to get started */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            How to get started with an FHSA
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium">Confirm eligibility.</span> You
              generally must be a first time homebuyer (under the CRA
              definition) and a resident of Canada. When in doubt, check the
              current FHSA rules.
            </li>
            <li>
              <span className="font-medium">Open an FHSA at a financial institution.</span>{" "}
              Many banks and brokerages now offer FHSA accounts. Choose one that
              lets you invest in products aligned with your risk tolerance.
            </li>
            <li>
              <span className="font-medium">
                Decide how much to contribute each year.
              </span>{" "}
              Consider your broader goals: emergency fund, TFSA, RRSP, and home
              timeline. You don’t have to max it right away for it to be useful.
            </li>
            <li>
              <span className="font-medium">Invest according to your timeframe.</span>{" "}
              If your home purchase is soon, you might want lower risk choices.
              If it’s several years out, you may choose more growth oriented
              investments.
            </li>
            <li>
              <span className="font-medium">Align FHSA with your housing plan.</span>{" "}
              Use this account as the “home bucket” in your overall strategy,
              and revisit your plan annually.
            </li>
          </ol>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate("/Portfolio")}>
              View portfolio
            </Button>
            <Button onClick={() => navigate("/Landing")}>Back to timeline</Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FHSA;
