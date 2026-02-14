import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  MessageSquare,
  HandshakeIcon,
  CheckCircle,
  Users,
  Award,
  ArrowRight,
} from 'lucide-react'

const steps = [
  {
    icon: BookOpen,
    title: 'List Your Books',
    description:
      'Upload photos and details of the books you want to share with the community.',
  },
  {
    icon: Users,
    title: 'Find Matches',
    description:
      'Browse thousands of books and find titles you want. Search by genre, author, or title.',
  },
  {
    icon: MessageSquare,
    title: 'Propose Exchange',
    description:
      'Send exchange requests to other members and negotiate the details of your swap.',
  },
  {
    icon: HandshakeIcon,
    title: 'Confirm Agreement',
    description:
      'Once both parties agree, finalize the exchange and arrange pickup or shipping.',
  },
  {
    icon: CheckCircle,
    title: 'Complete Exchange',
    description:
      'Exchange your books and confirm completion in the app. Leave reviews!',
  },
  {
    icon: Award,
    title: 'Build Reputation',
    description:
      'Earn badges and build your reputation as a trusted community member.',
  },
]

const benefits = [
  {
    title: 'Save Money',
    description:
      'Exchange books for free instead of buying new ones. Keep your wallet happy!',
  },
  {
    title: 'Discover New Books',
    description:
      'Access thousands of titles and get personalized recommendations from the community.',
  },
  {
    title: 'Connect with Readers',
    description:
      'Build meaningful connections with book lovers who share your interests.',
  },
  {
    title: 'Help the Environment',
    description:
      'Give books a second life and reduce waste. Every exchange helps the planet.',
  },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            How BookFlow Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple, transparent process for exchanging books and building a community of
            passionate readers
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">
            Simple Steps to Get Started
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>

                  {/* Card */}
                  <div className="p-6 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors h-full">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-secondary mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">
            Why Choose BookFlow?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-secondary">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">
            Safe & Secure Exchanges
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/20">
              <h3 className="font-bold text-lg text-secondary mb-3">Verified Members</h3>
              <p className="text-muted-foreground">
                All members are verified and must follow our community guidelines.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/20">
              <h3 className="font-bold text-lg text-secondary mb-3">Reviews & Ratings</h3>
              <p className="text-muted-foreground">
                See ratings from other community members to make informed decisions.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/20">
              <h3 className="font-bold text-lg text-secondary mb-3">Support Team</h3>
              <p className="text-muted-foreground">
                Our team is always available to help resolve any issues or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Ready to Start Exchanging?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of book lovers and start building your dream library today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                Browse Books
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/list-book">
              <Button variant="outline" className="px-8">
                List Your Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Is it really free?',
                a: 'Yes! BookFlow is completely free. You can list and exchange books at no cost.',
              },
              {
                q: 'How do I arrange pickup or shipping?',
                a: 'You can coordinate directly with the other member through our messaging system.',
              },
              {
                q: 'What if I receive a book in bad condition?',
                a: 'You can report the issue and our team will help resolve the dispute.',
              },
              {
                q: 'Can I sell books instead of exchanging?',
                a: 'BookFlow focuses on exchanges, but you can set your own terms with other members.',
              },
            ].map((faq, index) => (
              <div key={index} className="p-6 bg-card rounded-lg border border-border">
                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
