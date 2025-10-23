import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Docs() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" data-testid="link-home">
              <Button variant="ghost" className="gap-2" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Documentation Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2 flex items-center gap-3">
            <span className="text-primary">⚡</span>
            <span>Ponia Documentation</span>
          </h1>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-white">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ponia is a universal Web3 checkout that lets any dApp accept deposits and withdrawals from any blockchain — instantly and securely.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Built on LI.FI and Socket, Ponia simplifies cross-chain swaps into one simple, customizable widget.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-white">2. How It Works</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ponia enables seamless cross-chain transactions through an intelligent routing system that automatically finds the best path for your users' funds.
            </p>
            <div className="bg-card border border-border rounded-lg p-6 my-6">
              <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Universal chain support (Ethereum, Polygon, BNB, Solana, and more)</li>
                <li>• Automatic gas inclusion for destination chains</li>
                <li>• Transaction recovery and auto-routing on failures</li>
                <li>• Session persistence across browser tabs</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-white">3. Integration</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Integrate Ponia into your dApp in minutes with our simple widget.
            </p>
            <div className="bg-muted/20 border border-border rounded-lg p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-white">
{`npm install @ponia/widget

import { PoniaWidget } from '@ponia/widget';

<PoniaWidget
  appId="your-app-id"
  theme="dark"
  primaryColor="#FFD73F"
/>`}
              </pre>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-white">4. Pricing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ponia charges a simple 1.5% fee on all transactions. No hidden costs, no surprises.
            </p>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-heading font-bold text-primary">1.5%</span>
                <span className="text-muted-foreground">per transaction</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This includes all routing, gas optimization, and transaction recovery services.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-white">5. Support</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Need help integrating Ponia or have questions? We're here to support you.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" asChild data-testid="button-discord">
                <a href="https://discord.gg/ponia" target="_blank" rel="noopener noreferrer">
                  Join our Discord
                </a>
              </Button>
              <Button variant="outline" asChild data-testid="button-contact">
                <Link href="/#contact">
                  Contact us
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
