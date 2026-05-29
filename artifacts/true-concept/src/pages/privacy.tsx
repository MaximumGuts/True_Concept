import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 blob-bg space-y-6">
      <Link href="/">
        <button className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </Link>

      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl"
        style={{ background: "linear-gradient(135deg, #b85535 0%, #da6b45 60%, #f5a584 100%)" }}
      >
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider mb-3">
            <Shield className="w-3 h-3" /> Privacy
          </span>
          <h1 className="font-black text-2xl sm:text-3xl mb-1 tracking-tight">Privacy Policy</h1>
          <p className="text-white/90 font-medium text-sm">Last updated: 27 May 2026</p>
        </div>
      </div>

      <div className="liquid-panel rounded-3xl p-6 sm:p-8 prose prose-sm dark:prose-invert max-w-none space-y-5 text-gray-800 dark:text-gray-200">
        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">1. Who we are</h2>
          <p>
            TRUE CONCEPT is an educational platform for Class IX and X students in Assam, India,
            offering NCERT-aligned notes, MCQs, Q&amp;A, virtual labs, and full-length question
            papers. The platform is operated by Manas Jyoti Boruah. Contact:{" "}
            <a className="text-orange-700 dark:text-orange-300 font-black" href="mailto:manasjyoti.boruah1@gmail.com">
              manasjyoti.boruah1@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">2. What we collect</h2>
          <p>When you register or use TRUE CONCEPT, we may collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name, phone number, email address (for sign-up and sign-in).</li>
            <li>Your class level (IX / X), medium (English / Assamese), and board (SEBA / CBSE).</li>
            <li>Study activity — chapters visited, notes read, MCQ scores, time spent.</li>
            <li>Device information (device type, OS, browser) for diagnostics.</li>
            <li>Cookies and local storage for authentication and preferences.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">3. How we use your data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To create and maintain your account.</li>
            <li>To personalise content and AI study recommendations.</li>
            <li>To measure usage and improve the platform.</li>
            <li>To serve relevant advertisements (see Section 5).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">4. Third-party services</h2>
          <p>We use these services to operate TRUE CONCEPT:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Firebase</strong> (Authentication, Firestore, Cloud Functions, Hosting) by
              Google — for sign-in, data storage, and serving the app.
            </li>
            <li>
              <strong>Google Gemini API</strong> — for the AI Academic Mentor feature.
            </li>
            <li>
              <strong>Google AdSense</strong> (web) and <strong>Google AdMob</strong> (Android app)
              — for displaying advertisements.
            </li>
          </ul>
          <p className="mt-2">
            These providers have their own privacy policies. We do not control their practices.
          </p>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">5. Advertising</h2>
          <p>
            We use Google AdSense (on the website) and Google AdMob (in the Android app) to show
            advertisements. These ad networks may use cookies and identifiers to serve
            personalised ads based on your prior visits to this site and other sites on the
            internet.
          </p>
          <p className="mt-2">
            Google's use of advertising cookies is described in their{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-700 dark:text-orange-300 font-black"
            >
              Advertising Policy
            </a>
            . You can opt out of personalised advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-700 dark:text-orange-300 font-black"
            >
              Google Ad Settings
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">6. Data retention</h2>
          <p>
            We keep your account data while your account is active. You may request deletion of
            your account by emailing us at the address above; we will remove your personal data
            within 30 days of receiving a verified request.
          </p>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">7. Children's privacy</h2>
          <p>
            TRUE CONCEPT is designed for school students, including users under 18. We collect the
            minimum personal information required to deliver the service. Parents or guardians of
            students under 13 may contact us to request access to or deletion of their child's
            data.
          </p>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">8. Security</h2>
          <p>
            We use industry-standard measures (HTTPS, Firebase Authentication, signed JWT tokens)
            to protect your data. No system is perfectly secure, but we take reasonable steps to
            prevent unauthorised access.
          </p>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">9. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The latest version is always available at
            this URL with the &ldquo;Last updated&rdquo; date at the top.
          </p>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">10. Contact</h2>
          <p>
            For privacy questions, email{" "}
            <a className="text-orange-700 dark:text-orange-300 font-black" href="mailto:manasjyoti.boruah1@gmail.com">
              manasjyoti.boruah1@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
