import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
          <p><strong>Last Updated: June 8, 2026</strong></p>

          <p>
            At j8den.shia ("Company," "we," "us," or "our"), we respect your privacy and are committed to protecting it through our compliance with this Privacy Policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website or application (our "Service") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect several types of information from and about users of our Service, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Data:</strong> Information by which you may be personally identified, such as name, email address, and account credentials. This is primarily collected when you register for an account.</li>
            <li><strong>Usage Data:</strong> Information about your internet connection, the equipment you use to access our Service, and usage details. This includes IP addresses, browser types, interaction tracking (e.g., videos played, sheets downloaded), and diagnostic data.</li>
            <li><strong>User Content:</strong> Any data, comments, or files you choose to upload to our platform.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Collect Data</h2>
          <p>We collect this information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Directly from you when you provide it to us (e.g., filling out forms, creating an account).</li>
            <li>Automatically as you navigate through the site using cookies, web beacons, and other tracking technologies provided by third-party analytics services (such as Vercel Analytics).</li>
            <li>From third-party authentication providers (e.g., Supabase) used to manage secure access to your account.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Use of Your Information</h2>
          <p>We use information that we collect about you or that you provide to us:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To present our Service and its contents to you.</li>
            <li>To provide you with information, products, or services that you request from us.</li>
            <li>To manage your account and authenticate your identity.</li>
            <li>To monitor usage patterns and improve the performance and functionality of our Service.</li>
            <li>To notify you about changes to our Service or any products or services we offer.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Children's Privacy (COPPA Compliance)</h2>
          <p>
            Our Service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are under 13, do not use or provide any information on this Service or through any of its features. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information immediately. If you believe we might have any information from or about a child under 13, please contact us.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal data. We may disclose aggregated information about our users, and information that does not identify any individual, without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To contractors, service providers, and other third parties we use to support our business (e.g., database hosting via Supabase, analytics via Vercel) who are bound by contractual obligations to keep personal information confidential.</li>
            <li>To fulfill the purpose for which you provide it.</li>
            <li>To comply with any court order, law, or legal process, including responding to any government or regulatory request.</li>
            <li>If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of the Company, our customers, or others.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Data Retention and Deletion Rights</h2>
          <p>
            We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. You have the right to request access to, correction of, or deletion of your personal data. To initiate an account deletion request and purge your data from our systems, please contact our support team.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Security of Your Data</h2>
          <p>
            We have implemented industry-standard security measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Contact Information</h2>
          <p>
            To ask questions or comment about this Privacy Policy and our privacy practices, contact us at: <a href="mailto:jadenshia34@gmail.com" className="text-primary hover:underline">jadenshia34@gmail.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
