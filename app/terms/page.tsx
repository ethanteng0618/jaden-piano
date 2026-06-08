import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsOfService() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
          <p><strong>Last Updated: June 8, 2026</strong></p>

          <p>
            Welcome to j8den.shia ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website, applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Eligibility and Age Requirements</h2>
          <p>
            You must be at least 13 years of age to access or use our Service. By creating an account or using the Service, you represent and warrant that you are 13 years of age or older. If you are under 18, you must have your parent or legal guardian's permission to use the Service. We reserve the right to terminate accounts that are found to be in violation of these age requirements without prior notice.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Account Registration and Security</h2>
          <p>
            To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Medical and Physical Liability Disclaimer</h2>
          <p>
            The Service provides educational content related to piano performance, including technique drills and exercises. This content is for informational and educational purposes only. Engaging in instrumental practice involves physical exertion and repetitive movements, which carry an inherent risk of injury, such as Repetitive Strain Injury (RSI), tendonitis, or muscle fatigue. 
          </p>
          <p className="font-medium text-foreground">
            You agree that you are voluntarily participating in these activities and assume all risk of injury to yourself. The Company is not responsible for any physical or medical injuries sustained as a result of utilizing the Service's technique drills or lesson plans. Always consult with a qualified medical professional if you experience pain or discomfort during practice.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Intellectual Property Rights</h2>
          <p>
            The Service and its original content, features, and functionality (including but not limited to sheet music, video tutorials, and text) are and will remain the exclusive property of the Company and its licensors. Our intellectual property may not be used in connection with any product or service without the prior written consent of the Company.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. User-Generated Content and Acceptable Use</h2>
          <p>
            Users may have the ability to post comments or upload materials ("User Content"). You retain all rights to your User Content, but you grant the Company a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content in connection with the Service.
          </p>
          <p>
            You agree not to post any User Content that is defamatory, harassing, hateful, obscene, or violates the intellectual property rights of others. We maintain a zero-tolerance policy for abusive behavior. The Company reserves the right to review, remove, or modify User Content at its sole discretion, and to terminate the accounts of users who violate this acceptable use policy. If you encounter abusive content, you may report it to our moderation team via the contact information provided below.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall the Company, its affiliates, directors, employees, or licensors be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including damages for loss of profits, goodwill, data, or other intangible losses, arising out of or relating to your use of, or inability to use, the Service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Company operates, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in that jurisdiction.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Modifications to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, wish to report a violation, or submit a DMCA takedown notice, please contact us at: <a href="mailto:jadenshia34@gmail.com" className="text-primary hover:underline">jadenshia34@gmail.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
