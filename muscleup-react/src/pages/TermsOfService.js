import React from 'react';
import './LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using MuscleUp ("the Service"), you accept and agree to be bound by 
            the terms and provision of this agreement. If you do not agree to abide by the above, 
            please do not use this service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            MuscleUp is a fitness tracking application that allows users to log workouts, 
            track meals, monitor progress, and manage their fitness journey. The service 
            is provided "as is" and on an "as available" basis.
          </p>
        </section>

        <section>
          <h2>3. User Account</h2>
          <p>
            To use certain features of the Service, you must register for an account. 
            You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain the security of your password</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of unauthorized use</li>
          </ul>
        </section>

        <section>
          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Upload malicious code or spam</li>
            <li>Harass or harm other users</li>
            <li>Attempt to gain unauthorized access to the Service</li>
          </ul>
        </section>

        <section>
          <h2>5. Health and Fitness Disclaimer</h2>
          <p>
            <strong>Important:</strong> MuscleUp is not a medical device or health service. 
            The information provided is for general informational purposes only and should 
            not be considered as medical advice. Always consult with healthcare professionals 
            before starting any fitness program.
          </p>
          <ul>
            <li>We do not provide medical advice or diagnosis</li>
            <li>Fitness data is for tracking purposes only</li>
            <li>Use the app at your own risk and discretion</li>
            <li>Stop exercise immediately if you feel unwell</li>
          </ul>
        </section>

        <section>
          <h2>6. Privacy Policy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, 
            which also governs your use of the Service, to understand our practices.
          </p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will 
            remain the exclusive property of MuscleUp and its licensors. The Service is 
            protected by copyright, trademark, and other laws.
          </p>
        </section>

        <section>
          <h2>8. User Content</h2>
          <p>
            You retain ownership of the content you submit to the Service. By submitting 
            content, you grant us a worldwide, royalty-free license to use, modify, and 
            display such content in connection with the Service.
          </p>
        </section>

        <section>
          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, 
            without prior notice, for conduct that we believe violates these Terms or is 
            harmful to other users, us, or third parties.
          </p>
        </section>

        <section>
          <h2>10. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no 
            representations or warranties of any kind, express or implied, including but 
            not limited to fitness for a particular purpose or non-infringement.
          </p>
        </section>

        <section>
          <h2>11. Limitation of Liability</h2>
          <p>
            In no event shall MuscleUp be liable for any indirect, incidental, special, 
            consequential, or punitive damages, including without limitation, loss of 
            profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section>
          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a 
            revision is material, we will try to provide at least 30 days notice 
            prior to any new terms taking effect.
          </p>
        </section>

        <section>
          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
      
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
