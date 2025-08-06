import React from 'react';
import './LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            MuscleUp collects information you provide directly to us, such as when you create an account, 
            update your profile, log workouts, or track meals. This may include:
          </p>
          <ul>
            <li>Personal information (name, email address)</li>
            <li>Fitness data (workouts, exercises, sets, reps, weights)</li>
            <li>Nutrition data (meals, calories, macronutrients)</li>
            <li>Profile information (age, weight, height, fitness goals, activity level)</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our fitness tracking services</li>
            <li>Process your workouts and meal logs</li>
            <li>Generate fitness insights and progress reports</li>
            <li>Communicate with you about your account</li>
            <li>Improve and develop our services</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. 
            We may share your information only in the following circumstances:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, 
            no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our 
            services and fulfill the purposes outlined in this Privacy Policy, unless 
            a longer retention period is required by law.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Update or correct your information</li>
            <li>Delete your account and associated data</li>
            <li>Export your data</li>
            <li>Opt out of communications</li>
          </ul>
        </section>

        <section>
          <h2>7. Cookies and Tracking</h2>
          <p>
            MuscleUp uses local storage and session storage to enhance your experience 
            and maintain your login session. We do not use third-party tracking cookies.
          </p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13 years of age. We do not 
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of 
            any changes by posting the new Privacy Policy on this page and updating the 
            "Last updated" date.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@muscleup.app<br />
            <strong>Address:</strong> MuscleUp Fitness App<br />
            123 Fitness Street<br />
            Health City, HC 12345
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
