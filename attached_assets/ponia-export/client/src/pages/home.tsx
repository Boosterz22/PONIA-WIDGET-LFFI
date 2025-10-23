import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import CryptoParticlesBackground from "@/components/CryptoParticlesBackground";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Zap,
  Wallet,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Eye,
  Blocks,
  Code2,
  ExternalLink,
  FileText,
  Activity,
  Download,
  Upload,
  Fuel,
  Gamepad2,
  TrendingUp,
  Image,
  Sparkles,
} from "lucide-react";
import { SiDiscord, SiX } from "react-icons/si";

import poniaLogo from "@assets/8DDCA161-DEBE-4F1B-9DDE-ACC0974A8F99_1760877883398.png";
import ethLogo from "@assets/ethereum-eth-logo_1760751286633.png";
import bnbLogo from "@assets/bnb-bnb-logo_1760751286633.png";
import maticLogo from "@assets/polygon-matic-logo_1760751286633.png";
import btcLogo from "@assets/bitcoin-btc-logo_1760751286633.png";
import usdtLogo from "@assets/tether-usdt-logo_1760751286633.png";
import xrpLogo from "@assets/xrp-xrp-logo_1760751286633.png";

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [flowMode, setFlowMode] = useState<"deposit" | "withdraw">("deposit");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      emailOrDiscord: "",
      projectUrl: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            className="flex items-center hover-elevate transition-all rounded-md px-2 py-1"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            data-testid="logo-header"
          >
            <img src={poniaLogo} alt="Ponia" className="h-28" />
          </a>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="nav-how-it-works"
                >
                  How it works
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger data-testid="nav-solutions">Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate"
                        onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                        data-testid="nav-solutions-games"
                      >
                        <div className="text-sm font-medium leading-none">Web3 Games</div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          Frictionless top-ups
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate"
                        onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                        data-testid="nav-solutions-defi"
                      >
                        <div className="text-sm font-medium leading-none">Prediction Markets & DeFi</div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          Instant liquidity
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate"
                        onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                        data-testid="nav-solutions-nft"
                      >
                        <div className="text-sm font-medium leading-none">NFT Apps</div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          Seamless transactions
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  onClick={() => document.getElementById('integration')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="nav-integration"
                >
                  Integration
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  onClick={() => document.getElementById('fees')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="nav-fees"
                >
                  Fees
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/docs" data-testid="nav-docs">
                  <span className={navigationMenuTriggerStyle()}>
                    Docs
                  </span>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              data-testid="button-sign-in"
            >
              Sign in
            </Button>
            <Button
              data-testid="button-log-in"
            >
              Log in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <CryptoParticlesBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        <div className="relative max-w-5xl mx-auto text-center space-y-8" style={{ zIndex: 10 }}>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center mb-8">
              <img 
                src={poniaLogo} 
                alt="Ponia" 
                className="h-64 md:h-96 animate-pulse-glow" 
                data-testid="logo-hero"
              />
            </div>
            <p className="text-2xl md:text-4xl font-heading font-semibold mb-6 text-foreground leading-tight max-w-4xl mx-auto">
              Accept deposits & withdrawals from any chain — in <span className="text-primary" style={{ textShadow: '0 0 20px rgba(255, 215, 63, 0.6), 0 0 40px rgba(255, 215, 63, 0.3)' }}>60 seconds</span>.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center items-center mb-12 text-sm md:text-base text-muted-foreground">
              <span className="flex items-center gap-2" data-testid="badge-noncustodial">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Non-custodial
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-2" data-testid="badge-fee">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                1.5% fee
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-2" data-testid="badge-built">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Built on LI.FI/Socket
              </span>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-base px-8"
                data-testid="button-demo"
                asChild
              >
                <a 
                  href="https://61168d82-5fdb-428b-b1e8-f64d7517b75f-00-2p4syhzbahypa.kirk.replit.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Try Demo
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-base px-8 backdrop-blur-sm"
                data-testid="button-integrate"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Integrate in 1 min
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
            How Ponia works in 3 steps
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-lg">
            Built on LI.FI & Socket.tech — fast, secure, and non-custodial.
          </p>

          {/* Toggle Deposit/Withdraw */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex rounded-lg border border-border p-1 bg-background/50">
              <Button
                variant={flowMode === "deposit" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFlowMode("deposit")}
                className="gap-2"
                data-testid="button-toggle-deposit"
              >
                <Download className="w-4 h-4" />
                Deposit
              </Button>
              <Button
                variant={flowMode === "withdraw" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFlowMode("withdraw")}
                className="gap-2"
                data-testid="button-toggle-withdraw"
              >
                <Upload className="w-4 h-4" />
                Withdraw
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {flowMode === "deposit" ? (
              <>
                <Card className="p-8 hover-elevate hover:border-primary hover:shadow-lg transition-all duration-300" data-testid="card-step-1">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border-2 border-primary">
                    <span className="text-2xl font-heading font-bold text-primary">1</span>
                  </div>
                  <div className="mb-4">
                    <Wallet className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-xl font-heading font-semibold mb-3">Connect wallet</h3>
                  </div>
                  <p className="text-muted-foreground">
                    User connects via Ponia widget with their preferred wallet
                  </p>
                </Card>

                <Card className="p-8 hover-elevate hover:border-primary hover:shadow-lg transition-all duration-300" data-testid="card-step-2">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border-2 border-primary">
                    <span className="text-2xl font-heading font-bold text-primary">2</span>
                  </div>
                  <div className="mb-4">
                    <ArrowRightLeft className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-xl font-heading font-semibold mb-3">Choose token & chain</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Instant quote + ETA for any token on any supported chain
                  </p>
                </Card>

                <Card className="p-8 hover-elevate hover:border-primary hover:shadow-lg transition-all duration-300" data-testid="card-step-3">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border-2 border-primary">
                    <span className="text-2xl font-heading font-bold text-primary">3</span>
                  </div>
                  <div className="mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-xl font-heading font-semibold mb-3">Confirm</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Swap completes automatically, funds arrive ready to use
                  </p>
                </Card>
              </>
            ) : (
              <>
                <Card className="p-8 hover-elevate hover:border-primary hover:shadow-lg transition-all duration-300" data-testid="card-step-1">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border-2 border-primary">
                    <span className="text-2xl font-heading font-bold text-primary">1</span>
                  </div>
                  <div className="mb-4">
                    <ArrowRightLeft className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-xl font-heading font-semibold mb-3">Choose destination chain</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Select which chain you want to receive your funds on
                  </p>
                </Card>

                <Card className="p-8 hover-elevate hover:border-primary hover:shadow-lg transition-all duration-300" data-testid="card-step-2">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border-2 border-primary">
                    <span className="text-2xl font-heading font-bold text-primary">2</span>
                  </div>
                  <div className="mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-xl font-heading font-semibold mb-3">Confirm swap</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Review the transaction details and approve the withdrawal
                  </p>
                </Card>

                <Card className="p-8 hover-elevate hover:border-primary hover:shadow-lg transition-all duration-300" data-testid="card-step-3">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border-2 border-primary">
                    <span className="text-2xl font-heading font-bold text-primary">3</span>
                  </div>
                  <div className="mb-4">
                    <Fuel className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-xl font-heading font-semibold mb-3">Funds land instantly — ready to use</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Your tokens arrive on the destination chain with enough gas included to execute your first transaction
                  </p>
                </Card>
              </>
            )}
          </div>

          {/* Mini-FAQ */}
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              <span className="font-semibold">Dropped tab?</span> Resume where you left off. 
              <span className="mx-2">•</span>
              <span className="font-semibold">Failed route?</span> Auto-refund or re-route.
            </p>
          </div>

          {/* CTA Demo */}
          <div className="text-center mb-16">
            <Button 
              variant="outline" 
              size="lg"
              className="gap-2"
              data-testid="button-demo-cta"
            >
              See the 60-second demo
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          {/* Chain Support Banner */}
          <div className="relative overflow-hidden py-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground mb-6">
              Works with
            </p>
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll gap-12 items-center">
                {/* First set */}
                <div className="flex gap-12 items-center whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img src={ethLogo} alt="Ethereum" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">Ethereum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={maticLogo} alt="Polygon" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">Polygon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={bnbLogo} alt="BNB" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">BNB Chain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={btcLogo} alt="Bitcoin" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">Bitcoin</span>
                  </div>
                  <span className="text-muted-foreground/60">Solana</span>
                  <span className="text-muted-foreground/60">Base</span>
                  <span className="text-muted-foreground/60">Arbitrum</span>
                  <span className="text-muted-foreground/60">Avalanche</span>
                  <span className="text-muted-foreground/60">Optimism</span>
                  <div className="flex items-center gap-2">
                    <img src={xrpLogo} alt="XRP" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">XRP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={usdtLogo} alt="USDT" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">Tether</span>
                  </div>
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex gap-12 items-center whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img src={ethLogo} alt="Ethereum" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">Ethereum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={maticLogo} alt="Polygon" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">Polygon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={bnbLogo} alt="BNB" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">BNB Chain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={btcLogo} alt="Bitcoin" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">Bitcoin</span>
                  </div>
                  <span className="text-muted-foreground/60">Solana</span>
                  <span className="text-muted-foreground/60">Base</span>
                  <span className="text-muted-foreground/60">Arbitrum</span>
                  <span className="text-muted-foreground/60">Avalanche</span>
                  <span className="text-muted-foreground/60">Optimism</span>
                  <div className="flex items-center gap-2">
                    <img src={xrpLogo} alt="XRP" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">XRP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={usdtLogo} alt="USDT" className="w-6 h-6 opacity-40 grayscale" />
                    <span className="text-muted-foreground/60">Tether</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Ponia */}
      <section className="relative py-24 px-4 overflow-hidden">
        <CryptoParticlesBackground />
        <div className="relative max-w-6xl mx-auto" style={{ zIndex: 10 }}>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">
            Why top dApps use Ponia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-8 hover-elevate hover:border-primary/50 transition-all duration-300 group" data-testid="card-benefit-instant">
              <Zap className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-heading font-semibold mb-3">Instant UX</h3>
              <p className="text-muted-foreground">
                Less than 60 seconds, real-time ETA updates for complete transparency
              </p>
            </Card>

            <Card className="p-8 hover-elevate hover:border-primary/50 transition-all duration-300 group" data-testid="card-benefit-bidirectional">
              <ArrowRightLeft className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-heading font-semibold mb-3">Deposit & Withdraw</h3>
              <p className="text-muted-foreground">
                One widget for both directions — seamless user experience
              </p>
            </Card>

            <Card className="p-8 hover-elevate hover:border-primary/50 transition-all duration-300 group" data-testid="card-benefit-transparent">
              <Eye className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-heading font-semibold mb-3">Transparent Fees</h3>
              <p className="text-muted-foreground">
                Always 1.5%, no hidden costs or surprise charges
              </p>
            </Card>

            <Card className="p-8 hover-elevate hover:border-primary/50 transition-all duration-300 group" data-testid="card-benefit-plugplay">
              <Blocks className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-heading font-semibold mb-3">Plug & Play</h3>
              <p className="text-muted-foreground">
                1 line of code, no partnership needed — integrate in minutes
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" data-testid="button-integrate-why">
              Integrate Ponia
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* For Developers */}
      <section id="integration" className="py-24 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Integration made simple
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Add Ponia in one minute. Let your users deposit from any chain.
              </p>
              <Button variant="outline" size="lg" data-testid="button-docs">
                <FileText className="w-4 h-4 mr-2" />
                View full documentation
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <Card className="p-8 bg-muted/30 border-primary/30" data-testid="card-code">
              <div className="flex items-center justify-between mb-4">
                <Code2 className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground font-mono">HTML</span>
              </div>
              <pre className="text-sm font-mono text-foreground overflow-x-auto">
                <code>{`<script src="https://ponia.io/widget.js">
</script>
<button onclick="openPonia()">
  Swap with Ponia
</button>`}</code>
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats & Transparency */}
      <section className="relative py-24 px-4 overflow-hidden">
        <CryptoParticlesBackground />
        <div className="relative max-w-6xl mx-auto" style={{ zIndex: 10 }}>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">
            Transparency is built in.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover-elevate transition-all" data-testid="card-stat-eta">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2 animate-counter">
                <AnimatedCounter end={43} suffix="s" />
              </div>
              <p className="text-muted-foreground">Average ETA</p>
            </Card>

            <Card className="p-8 text-center hover-elevate transition-all" data-testid="card-stat-success">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2 animate-counter">
                <AnimatedCounter end={99.2} suffix="%" />
              </div>
              <p className="text-muted-foreground">Success rate</p>
            </Card>

            <Card className="p-8 text-center hover-elevate transition-all" data-testid="card-stat-fee">
              <Activity className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2 animate-counter">
                <AnimatedCounter end={1.5} suffix="%" />
              </div>
              <p className="text-muted-foreground">Average fee</p>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" data-testid="button-view-status">
              <Activity className="w-4 h-4 mr-2" />
              View live status
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Fees */}
      <section id="fees" className="py-24 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Simple, transparent pricing
          </h2>
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-6xl md:text-7xl font-heading font-bold text-primary mb-4">
                1.5%
              </div>
              <p className="text-xl text-muted-foreground">
                Flat fee on all transactions
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="p-6">
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No hidden costs
              </p>
            </Card>
            <Card className="p-6">
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No setup fees
              </p>
            </Card>
            <Card className="p-6">
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No monthly charges
              </p>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
            You only pay for what you use. The 1.5% fee covers cross-chain routing, gas optimization, and infrastructure costs. No surprises, ever.
          </p>
        </div>
      </section>

      {/* For dApps */}
      <section id="solutions" className="py-24 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Join the universal Web3 checkout network
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-8">
              Whether you're building a game, a prediction market, or an NFT app, Ponia lets your users deposit or withdraw from any chain instantly — without bridges, delays, or complexity.
            </p>
            <p className="text-base text-primary leading-relaxed max-w-4xl mx-auto">
              By keeping every transaction inside your platform, Ponia eliminates the usual friction points that make users leave. No redirects, no external bridges, no confusion. Your users stay where they are — and they complete more actions. That means higher retention, stronger engagement, and better conversions across your product.
            </p>
          </div>

          {/* Use Cases Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-8 hover-elevate hover:border-primary/50 transition-all duration-300 group" data-testid="card-usecase-gaming">
              <Gamepad2 className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-heading font-semibold mb-3">For Web3 games</h3>
              <p className="text-muted-foreground">
                Ponia enables frictionless top-ups from any chain, keeping players focused on the experience instead of the transaction.
              </p>
            </Card>

            <Card className="p-8 hover-elevate hover:border-primary/50 transition-all duration-300 group" data-testid="card-usecase-defi">
              <TrendingUp className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-heading font-semibold mb-3">For prediction markets & DeFi</h3>
              <p className="text-muted-foreground">
                It allows users to move liquidity instantly, improving retention and overall volume.
              </p>
            </Card>

            <Card className="p-8 hover-elevate hover:border-primary/50 transition-all duration-300 group" data-testid="card-usecase-nft">
              <Image className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-heading font-semibold mb-3">For NFT platforms</h3>
              <p className="text-muted-foreground">
                Ponia makes cross-chain transactions simple and seamless so that creators and collectors can interact freely without technical barriers.
              </p>
            </Card>
          </div>

          {/* Additional Copy */}
          <div className="text-center mb-10">
            <p className="text-base text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Beyond these categories, Ponia is designed for every Web3 application that needs instant and transparent cross-chain value movement. From staking dashboards to launchpads and other decentralized experiences, it provides a universal foundation that keeps the user experience fluid.
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center border-t border-border pt-12">
            <p className="text-lg text-muted-foreground mb-6">
              Join the growing network of Web3 builders shaping the next generation of interoperability.
            </p>
            <Button 
              size="lg" 
              className="gap-2 mb-4"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-launch-partner"
            >
              Become a Launch Partner — Apply now
            </Button>
            <p className="text-sm text-muted-foreground">
              Early partners receive priority access and reduced fees.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="relative py-24 px-4 overflow-hidden">
        <CryptoParticlesBackground />
        <div className="relative max-w-4xl mx-auto" style={{ zIndex: 10 }}>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">
            What's next for Ponia
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 group" data-testid="roadmap-mvp">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div className="w-0.5 h-full bg-border mt-2" />
              </div>
              <div className="pb-12">
                <h3 className="text-xl font-heading font-semibold mb-2">MVP — Deposit & Withdraw widget</h3>
                <p className="text-muted-foreground">Core functionality complete and live</p>
              </div>
            </div>

            <div className="flex gap-6 group" data-testid="roadmap-fastmode">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-muted border-2 border-primary/50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="w-0.5 h-full bg-border mt-2" />
              </div>
              <div className="pb-12">
                <h3 className="text-xl font-heading font-semibold mb-2">Fast Mode — Advanced liquidity</h3>
                <p className="text-muted-foreground">Instant swaps with optimized routing</p>
              </div>
            </div>

            <div className="flex gap-6 group" data-testid="roadmap-dashboard">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-muted border-2 border-primary/50 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div className="w-0.5 h-full bg-border mt-2" />
              </div>
              <div className="pb-12">
                <h3 className="text-xl font-heading font-semibold mb-2">Partner Dashboard — Analytics & revenue share</h3>
                <p className="text-muted-foreground">Track performance and earnings in real-time</p>
              </div>
            </div>

            <div className="flex gap-6 group" data-testid="roadmap-sdk">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-muted border-2 border-primary/50 flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">SDK — NPM package integration</h3>
                <p className="text-muted-foreground">Full TypeScript support and React components</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 px-4 bg-card" id="contact">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
            Ready to integrate Ponia?
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            We're onboarding our first partners.<br />
            Let's build the future of Web3 payments together.
          </p>
          
          <Card className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  data-testid="input-name"
                  {...form.register("name")}
                  className="bg-background"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailOrDiscord">Email / Discord</Label>
                <Input
                  id="emailOrDiscord"
                  data-testid="input-email"
                  {...form.register("emailOrDiscord")}
                  className="bg-background"
                />
                {form.formState.errors.emailOrDiscord && (
                  <p className="text-sm text-destructive">{form.formState.errors.emailOrDiscord.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectUrl">Project URL</Label>
                <Input
                  id="projectUrl"
                  data-testid="input-project-url"
                  type="url"
                  placeholder="https://"
                  {...form.register("projectUrl")}
                  className="bg-background"
                />
                {form.formState.errors.projectUrl && (
                  <p className="text-sm text-destructive">{form.formState.errors.projectUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  data-testid="input-message"
                  rows={5}
                  {...form.register("message")}
                  className="bg-background resize-none"
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={contactMutation.isPending}
                data-testid="button-submit"
              >
                {contactMutation.isPending ? "Sending..." : "Submit"}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border py-12 px-4 overflow-hidden">
        <CryptoParticlesBackground />
        <div className="relative max-w-6xl mx-auto" style={{ zIndex: 10 }}>
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center justify-center">
              <img src={poniaLogo} alt="Ponia" className="h-32" data-testid="logo-footer" />
            </div>
            
            <p className="text-muted-foreground text-center">
              Instant. Transparent. Universal.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <a 
                href="#" 
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                data-testid="link-twitter"
              >
                <SiX className="w-5 h-5" />
                X
              </a>
              <a 
                href="#" 
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                data-testid="link-discord"
              >
                <SiDiscord className="w-5 h-5" />
                Discord
              </a>
              <Link 
                href="/docs" 
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                data-testid="link-docs"
              >
                <FileText className="w-5 h-5 text-primary" />
                Docs
              </Link>
              <a 
                href="#" 
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                data-testid="link-status"
              >
                <Activity className="w-5 h-5 text-primary" />
                Status
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              © 2025 Ponia — Non-custodial cross-chain checkout for Web3 apps.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
