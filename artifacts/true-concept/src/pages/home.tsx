import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetSubjects } from "@workspace/api-client-react";
import { BookOpen, FlaskConical, TrendingUp, Play, CheckCircle, Zap, Award } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Calculator: TrendingUp,
  FlaskConical,
  TrendingUp,
  BookOpen,
};

export default function HomePage() {
  const { data: subjects } = useGetSubjects();

  const features = [
    { icon: BookOpen, title: "Chapter-wise Notes", desc: "Comprehensive text notes for every chapter, organized clearly for quick revision." },
    { icon: CheckCircle, title: "MCQ Practice", desc: "Instant feedback quizzes with detailed explanations to reinforce your learning." },
    { icon: Play, title: "Video Explanations", desc: "YouTube video lessons linked to each chapter for visual learners." },
    { icon: FlaskConical, title: "Virtual Science Lab", desc: "Interactive simulations of science experiments — no lab equipment needed." },
    { icon: Zap, title: "Q&A Bank", desc: "Important exam questions with step-by-step detailed answers." },
    { icon: Award, title: "Progress Tracking", desc: "Track which chapters you have studied and your MCQ scores." },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-[hsl(222,47%,11%)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,47%,8%)] via-[hsl(222,47%,11%)] to-[hsl(222,40%,16%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[hsl(45,93%,47%)]/20 border border-[hsl(45,93%,47%)]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[hsl(45,93%,47%)]" />
              <span className="text-[hsl(45,93%,47%)] text-sm font-medium">SEBA / CBSE Board Courses</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6" data-testid="heading-hero">
              TRUE
              <span className="block text-[hsl(45,93%,47%)]">CONCEPT</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-200 font-light mb-2 italic">
              Concepts. Clarity. Confidence.
            </p>
            <p className="text-blue-300 text-lg mb-10 max-w-xl">
              A premium digital learning portal for Class IX and X students. Study smarter with organized notes, interactive quizzes, and virtual science labs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[hsl(45,93%,47%)] text-[hsl(222,47%,11%)] hover:bg-[hsl(45,93%,40%)] font-bold text-base px-8 h-12"
                  data-testid="button-get-started"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/subjects">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-medium text-base px-8 h-12"
                  data-testid="button-explore"
                >
                  Explore Subjects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Available Subjects
          </h2>
          <p className="text-muted-foreground text-lg">
            Covering Class IX and X curriculum as per SEBA and CBSE boards
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects?.map((subject) => {
            const Icon = iconMap[subject.icon] ?? BookOpen;
            return (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <div
                  data-testid={`card-subject-${subject.id}`}
                  className="group bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: subject.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{subject.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {subject.classLevels.map((cl) => (
                        <span
                          key={cl}
                          className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {cl}
                        </span>
                      ))}
                    </div>
                    {subject.chapterCount !== undefined && (
                      <span className="text-xs text-muted-foreground">{subject.chapterCount} chapters</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
          {!subjects && (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-xl mb-4" />
                <div className="h-5 bg-muted rounded mb-2 w-3/4" />
                <div className="h-4 bg-muted rounded mb-1 w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[hsl(222,47%,11%)] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
              Everything You Need to
              <span className="text-[hsl(45,93%,47%)]"> Excel</span>
            </h2>
            <p className="text-blue-300 text-lg">
              A complete digital study companion for board exam preparation
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[hsl(45,93%,47%)]/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[hsl(45,93%,47%)]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-blue-300 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ready to Start Learning?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Join students who are already learning smarter with TRUE CONCEPT. Login to access all study materials.
        </p>
        <Link href="/login">
          <Button
            size="lg"
            className="bg-[hsl(222,47%,25%)] text-white hover:bg-[hsl(222,47%,20%)] font-semibold px-10 h-12"
            data-testid="button-cta-login"
          >
            Login to Your Account
          </Button>
        </Link>
      </section>
    </div>
  );
}
