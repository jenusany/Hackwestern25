// src/pages/TFSA.tsx
import { DollarSign, PiggyBank } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TFSA = () => {
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
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Tax-Free Savings Account (TFSA)
              </h2>
              <p className="text-muted-foreground text-sm">
                A flexible, tax-free way to grow your money over time.
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
            What is a TFSA?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Tax Free Savings Account (TFSA) is a registered investment account
            that lets your money grow tax free. You can hold things like cash,
            ETFs, stocks, mutual funds, or GICs inside it. Unlike a regular
            investment account, you don’t pay tax on the growth, interest, or
            dividends earned inside a TFSA—even when you withdraw the money.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            The government gives you a limited amount of{" "}
            <span className="font-medium">contribution room</span> each year.
            If you don’t use it, it carries forward. Withdrawals generally free
            up room again in the following year. Always double check your
            current TFSA room with the CRA or your online tax account.
          </p>
        </section>

        {/* Why it's important */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            Why is the TFSA important?
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium">Tax free growth:</span> Any gains,
              dividends, or interest stay tax free, which can make a big
              difference over decades.
            </li>
            <li>
              <span className="font-medium">Flexibility:</span> You can use it
              for short term goals (travel, car, moving) or long term goals
              (financial independence, retirement).
            </li>
            <li>
              <span className="font-medium">No tax on withdrawals:</span> Taking
              money out doesn’t trigger tax, which gives you more control over
              your cash flow.
            </li>
            <li>
              <span className="font-medium">Great starter account:</span> For
              many people, the TFSA is the first place to invest once the
              emergency fund is in good shape.
            </li>
          </ul>
        </section>

        {/* How to get started */}
        <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            How to get started with a TFSA
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium">Check your eligibility & room.</span>{" "}
              You need to be at least 18 (or your province’s age of majority)
              and a Canadian resident for tax purposes. Log into your CRA
              account or check with a tax professional to see your available
              TFSA room.
            </li>
            <li>
              <span className="font-medium">Choose where to open it.</span>{" "}
              Common options include online brokerages, digital banks, and
              traditional banks. Look for low fees and easy to use tools.
            </li>
            <li>
              <span className="font-medium">Decide what to hold inside.</span>{" "}
              The TFSA is just the “wrapper.” Inside, you might hold index
              ETFs, savings products, or other investments that fit your risk
              level and time horizon.
            </li>
            <li>
              <span className="font-medium">Set up automatic contributions.</span>{" "}
              Even small monthly amounts add up. Automating deposits helps you
              build wealth in the background.
            </li>
            <li>
              <span className="font-medium">Avoid over contributing.</span> Going
              over your TFSA room can trigger penalties. When in doubt, confirm
              your room before contributing.
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

export default TFSA;
