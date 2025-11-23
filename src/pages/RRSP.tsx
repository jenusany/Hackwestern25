// src/pages/RRSP.tsx
import { DollarSign, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RRSP = () => {
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
              <LineChart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Registered Retirement Savings Plan (RRSP)
              </h2>
              <p className="text-muted-foreground text-sm">
                A long term engine for retirement and financial independence.
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
            What is an RRSP?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Registered Retirement Savings Plan (RRSP) is a tax advantaged
            account meant to help you save and invest for retirement. You
            usually get a tax deduction for contributions you make, and the
            investments inside the account grow tax deferred until you withdraw
            them in the future.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            The government limits how much you can contribute each year, usually
            based on your earned income from the previous year plus any unused
            room. Withdrawals in retirement are generally taxed as income, but
            often at a lower tax rate if you’re no longer working full time.
          </p>
        </section>

        {/* Why it's important */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            Why is the RRSP important?
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium">Tax deductions today:</span> RRSP
              contributions can reduce your taxable income, potentially giving
              you a refund or lowering your tax bill.
            </li>
            <li>
              <span className="font-medium">Tax deferred growth:</span> Your
              investments can grow without being taxed each year, which can help
              your money compound more efficiently.
            </li>
            <li>
              <span className="font-medium">Retirement income backbone:</span>{" "}
              RRSP savings can later be converted into RRIFs or annuities,
              forming a key part of your retirement income.
            </li>
            <li>
              <span className="font-medium">Helpful for higher income years:</span>{" "}
              RRSPs can be especially powerful when your income (and tax rate)
              is higher now than it might be in retirement.
            </li>
          </ul>
        </section>

        {/* How to get started */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            How to get started with an RRSP
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium">Check your RRSP contribution room.</span>{" "}
              You can usually find this on your latest Notice of Assessment or
              through your CRA online account.
            </li>
            <li>
              <span className="font-medium">Open an RRSP if you don’t have one.</span>{" "}
              Most banks, credit unions, and online brokerages offer RRSP
              accounts where you can hold various investments.
            </li>
            <li>
              <span className="font-medium">Choose your investment mix.</span>{" "}
              Since RRSPs are long term, many people use diversified portfolios
              (like broad index ETFs) aligned with their risk tolerance and time
              to retirement.
            </li>
            <li>
              <span className="font-medium">
                Decide on a contribution strategy.
              </span>{" "}
              You can contribute regularly throughout the year or make lump sum
              contributions, especially before the annual RRSP deadline.
            </li>
            <li>
              <span className="font-medium">Plan around your tax rate.</span>{" "}
              In some cases, you might choose to carry forward your deduction to
              a future year when your income and tax rate are higher. Consider
              getting professional advice for tax decisions.
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

export default RRSP;
