// src/pages/Maternity.tsx
import { useState } from "react";
import { DollarSign, Baby, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Maternity = () => {
  const navigate = useNavigate();

  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [benefitPercent, setBenefitPercent] = useState<string>("55");
  const [leaveMonths, setLeaveMonths] = useState<string>("12");

  const [monthlyShortfall, setMonthlyShortfall] = useState<number | null>(null);
  const [totalShortfall, setTotalShortfall] = useState<number | null>(null);

  const handleCalculate = () => {
    const income = parseFloat(monthlyIncome);
    const percent = parseFloat(benefitPercent);
    const months = parseFloat(leaveMonths);

    if (
      isNaN(income) ||
      isNaN(percent) ||
      isNaN(months) ||
      income <= 0 ||
      percent < 0 ||
      months <= 0
    ) {
      setMonthlyShortfall(null);
      setTotalShortfall(null);
      return;
    }

    const incomeOnLeave = (income * percent) / 100;
    const shortfallPerMonth = income - incomeOnLeave;
    const total = shortfallPerMonth * months;

    setMonthlyShortfall(shortfallPerMonth);
    setTotalShortfall(total);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString(undefined, {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });

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
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard
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
              <Baby className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Maternity & Parental Leave Fund
              </h2>
              <p className="text-muted-foreground text-sm">
                A buffer for income gaps and new costs during pregnancy and early parenting.
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
            What is a maternity & parental leave fund?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A maternity and parental leave fund is a dedicated pool of savings
            you build to cover the gap between your usual income and what
            you’ll receive while on leave. Even if your country or employer
            provides benefits, they often replace only a portion of your income.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            This fund is meant to give you <span className="font-medium">
              breathing room
            </span>{" "}
            during pregnancy, recovery, and early parenting, so you’re not
            stressing about bills while also managing a tiny human, sleep
            deprivation, and a brand new routine.
          </p>
        </section>

        {/* Why it's important */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            Why is this fund important?
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium">Income drops, expenses rise:</span>{" "}
              You may receive only a percentage of your income while facing new
              costs like baby gear, medical appointments, or childcare.
            </li>
            <li>
              <span className="font-medium">Reduces money stress:</span> Having
              this fund means you can focus on recovery and your baby rather
              than scrambling to cover bills.
            </li>
            <li>
              <span className="font-medium">Supports career flexibility:</span>{" "}
              A stronger savings cushion may give you more choice about how long
              you stay off work or how quickly you return.
            </li>
            <li>
              <span className="font-medium">Protects long-term goals:</span> With
              a dedicated fund, you’re less likely to drain retirement savings
              or take on high-interest debt during leave.
            </li>
          </ul>
        </section>

        {/* How to get started */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            How to get started with a maternity & parental leave fund
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium">
                Understand your benefits and policies.
              </span>{" "}
              Check your government benefits, your employer’s top-ups (if any),
              and how long you plan to be off. Note the percentage of income
              you’ll receive and any waiting periods.
            </li>
            <li>
              <span className="font-medium">
                Estimate your leave income and expenses.
              </span>{" "}
              Compare your usual monthly income and spending to what they might
              look like during leave. This helps you figure out how big the gap
              is.
            </li>
            <li>
              <span className="font-medium">
                Choose where to keep the fund.
              </span>{" "}
              Because this is a relatively short to medium term goal, many
              people keep it in a high interest savings account or another low
              risk place rather than long term investments.
            </li>
            <li>
              <span className="font-medium">
                Automate contributions before leave.
              </span>{" "}
              Decide on a monthly saving target and treat it like a non-negotiable
              bill to your future self.
            </li>
            <li>
              <span className="font-medium">Revisit the plan regularly.</span>{" "}
              As your timeline, salary, or benefits change, update your target
              and contribution amount.
            </li>
          </ol>
        </section>

        {/* Calculator */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">
              Estimate your income gap on leave
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            This is a simple, educational estimate. Actual benefits depend on
            government rules, employer policies, taxes, and other factors.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-foreground mb-1">
                Current after tax monthly income (approx.)
              </label>
              <input
                type="number"
                className="border border-border/60 rounded-md bg-background px-3 py-2 text-sm"
                placeholder="e.g. 4000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                min={0}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-foreground mb-1">
                % of income you expect to receive on leave
              </label>
              <input
                type="number"
                className="border border-border/60 rounded-md bg-background px-3 py-2 text-sm"
                placeholder="e.g. 55"
                value={benefitPercent}
                onChange={(e) => setBenefitPercent(e.target.value)}
                min={0}
                max={100}
              />
              <span className="text-[11px] text-muted-foreground mt-1">
                For example, 55 means you receive 55% of your usual income.
              </span>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-foreground mb-1">
                Length of leave (months)
              </label>
              <input
                type="number"
                className="border border-border/60 rounded-md bg-background px-3 py-2 text-sm"
                placeholder="e.g. 12"
                value={leaveMonths}
                onChange={(e) => setLeaveMonths(e.target.value)}
                min={1}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleCalculate}>Calculate income gap</Button>
          </div>

          {monthlyShortfall !== null && totalShortfall !== null && (
            <div className="mt-5 rounded-xl border border-border/60 bg-background/60 p-4">
              <h4 className="text-sm font-semibold mb-2 text-foreground">
                Your estimated gap
              </h4>
              <p className="text-sm text-muted-foreground mb-1">
                Approximate shortfall <span className="font-medium">per month</span>:{" "}
                <span className="font-semibold">
                  {formatCurrency(monthlyShortfall)}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Total estimated shortfall over{" "}
                <span className="font-medium">
                  {leaveMonths} month{parseFloat(leaveMonths) > 1 ? "s" : ""}
                </span>
                :{" "}
                <span className="font-semibold">
                  {formatCurrency(totalShortfall)}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                This gives you a rough target for your maternity & parental leave
                fund. You might aim to cover all of it, or just enough to feel
                comfortable.
              </p>
            </div>
          )}

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

export default Maternity;
