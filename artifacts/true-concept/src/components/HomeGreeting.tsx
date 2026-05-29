import { useAuth } from "@/contexts/AuthContext";
import { getGreeting, getFirstName } from "@/lib/progress/greeting";
import { motion } from "framer-motion";

/**
 * Personalized greeting card shown to logged-in students.
 * Returns null for non-students or non-logged-in visitors so the
 * marketing hero stays untouched.
 */
export default function HomeGreeting() {
  const { user } = useAuth();
  if (!user || user.role !== "student") return null;

  const greeting = getGreeting();
  const firstName = getFirstName(user.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="liquid-card rounded-3xl px-6 py-5 mx-4 sm:mx-6 lg:mx-auto max-w-7xl mt-6 mb-2 flex items-center gap-4"
      style={{ border: "1px solid rgba(218,107,69,0.18)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0"
        style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
      >
        {greeting.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-0.5">
          {greeting.text}
        </p>
        <h2 className="font-black text-xl sm:text-2xl text-foreground tracking-tight truncate">
          {firstName ? `${firstName} 👋` : "Welcome back 👋"}
        </h2>
      </div>
    </motion.div>
  );
}
