'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  UserCircle, 
  Briefcase, 
  FileCheck, 
  Banknote, 
  Wallet 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/login';
    return user.role === 'BORROWER' ? '/home' : '/dashboard';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                LendOS
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#roles" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">For Teams</a>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link href={getDashboardLink()}>
                  <Button variant="primary" className="rounded-full shadow-sm hover:shadow-md transition-all">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="rounded-full hidden sm:inline-flex border-slate-200">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" className="rounded-full shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-blue-600 to-indigo-600 border-none">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-white"></div>
        <div className="absolute right-0 top-20 -z-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute left-10 top-40 -z-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
            Smart Loan Management <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Platform
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-slate-600 mx-auto mb-10 leading-relaxed">
            The complete infrastructure for modern lending. Seamless workflows for borrowers, and powerful tools for sales, sanction, and collection teams.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href={isAuthenticated ? getDashboardLink() : "/register"}>
              <Button className="h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 border-none">
                Apply for Loan <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/login">
                <Button variant="outline" className="h-12 px-8 rounded-full text-base font-medium border-slate-200 hover:bg-slate-50 transition-all">
                  Sign in to Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why choose LendOS?</h2>
            <p className="mt-4 text-slate-600">Built for speed, security, and transparency.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-yellow-500" />}
              title="Easy Application"
              description="Apply for loans in under 5 minutes with our streamlined multi-step digital form."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
              title="Fast Approval"
              description="Automated rule engines and dedicated sanction dashboards ensure lightning-fast approvals."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6 text-green-500" />}
              title="Secure Payments"
              description="Bank-grade security for all your financial data and repayment collections."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="h-6 w-6 text-purple-500" />}
              title="Real-Time Tracking"
              description="Track your loan status instantly from application to final disbursement."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How it Works</h2>
            <p className="mt-4 text-slate-600">A transparent journey from start to finish.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
            
            {[
              { step: '1', title: 'Register', desc: 'Create your secure account instantly.' },
              { step: '2', title: 'Apply Loan', desc: 'Provide your details and upload salary slips.' },
              { step: '3', title: 'Get Approved', desc: 'Our team reviews and sanctions your request.' },
              { step: '4', title: 'Track & Repay', desc: 'Funds are disbursed. Track your balance easily.' }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white pt-8 pb-6 px-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Info */}
      <section id="roles" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Built for Every Team</h2>
            <p className="mt-4 text-slate-400">Strict Role-Based Access Control keeps your operations secure and focused.</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            <RoleCard icon={<UserCircle />} title="Borrower" desc="Apply, track, and manage personal loans." />
            <RoleCard icon={<Briefcase />} title="Sales" desc="Monitor new leads and registrations." />
            <RoleCard icon={<FileCheck />} title="Sanction" desc="Review documents and approve applications." />
            <RoleCard icon={<Banknote />} title="Disbursement" desc="Transfer funds to sanctioned accounts." />
            <RoleCard icon={<Wallet />} title="Collection" desc="Log payments and track outstanding dues." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-2 mb-8">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">LendOS</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} LendOS Platform. All rights reserved. Built for fintech innovation.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Reusable Components for Landing Page
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function RoleCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h4 className="text-lg font-medium text-white mb-2">{title}</h4>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );
}
