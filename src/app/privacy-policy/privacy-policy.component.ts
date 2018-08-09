import { Component, OnInit } from "@angular/core";

@Component({
  selector: "privacy-policy",
  template: `
  <div fxLayout="row" fxLayoutAlign="center">
  <div fxFlex.lg="40%" fxFlex.md="60%" fxFlex.lt-md="95%">

<h1 id="toc_0">Choose When Privacy Policy</h1>

<p>Last Updated 09/08/2018</p>

<h3 id="toc_1">Summary</h3>

<p>Choose When is a web application by Daniel Stone. It can be found at the following URL: <a href="https://choose-when.daniel-stone.uk">https://choose-when.daniel-stone.uk</a>. I am committed to maintaining trust between users and my site, hence I’d like you to know that I will never sell any personal information that I collect on my site. This is outlined in the privacy policy below which contains more details on the data I collect, how I use it and the limited conditions under which it is disclosed to others.</p>

<h2 id="toc_2">Cookies</h2>

<p>Choose When uses Cookies and other modern web technologies, including local storage to make the service easier to use – this includes optimising the login flow, as well as remembering logged in users details.</p>

<h2 id="toc_3">Personally Identifiable Information</h2>

<ul>
<li>Choose When does not collect any unnecessary data from its users,  in order to meet legal requirements.</li>
<li>I collect your email address at signup. This is in order to send a web URL that will verify your email address. I may also use your email address to provide you with important website and security updates, however, this will be extremely rare. I will not send out promotional emails or product updates about the service.</li>
<li>I do not collect a password for your account on signup, just your email.</li>
<li>If you are a school admin user, Choose When will collect information related to your school. This includes but is not limited to:

<ul>
<li>School name</li>
<li>School email domain</li>
<li>Personally identifiable information about students in the school, including email address and display name.</li>
<li>Timetable details</li>
</ul></li>
<li>As a student, Choose When will use your email address to find the school details above and then associate your email with information such as display name. These links are confirmed at signup, and if you do not confirm that the details are correct then I will not associate them to your account.</li>
<li>When using the service, your preferences are stored to your account. These are not publicly accessible - only your school admin can view it. If, at any point, you would like to remove these preferences or find out the contact details of your school admin please contact support@daniel-stone.uk</li>
</ul>

<h2 id="toc_4">Security</h2>

<p>I have implemented processes that should protect user information and security of data. Data is sent over SSL encryption to maintain it&rsquo;s integrity. It is up to you to make sure that your email address remains secure. In case you believe that your email address has been compromised, please contact support@daniel-stone.uk to protect your Choose When account. Choose When is hosted on Google Firebase and I have attempted to secure data through security technologies provided.</p>

<p>This helps prevent unauthorised access to data and ensures that data is used appropriately, however, <strong>I CAN NOT GUARANTEE THAT YOUR INFORMATION AND DATA WILL BE SECURE FROM UNAUTHORISED INTRUSIONS AND RELEASE TO THIRD PARTIES.</strong></p>

<p>In the case of a data breach that I am aware of, I will contact the affected users.</p>

<h2 id="toc_5">Third Parties</h2>

<p>I process user data through third parties since it is necessary for the operation of my service. I use Google&rsquo;s Firebase for Authentication and Realtime Database. I have confirmed that these third parties adhere to my privacy policy and are also compliant with GDPR.</p>

<p>Please read Google Cloud&rsquo;s privacy policy here: <a href="https://cloud.google.com/terms/">https://cloud.google.com/terms/</a></p>

<p>I may also share limited user data with a third party if it is required to do so by law, or  1) if I believe that disclosure is necessary to a) comply with any legal processes b) enforce this privacy policy c) protect the rights, property or personal safety of the Website, its users and or the public. 2) you are a school admin and a user has requested your email address.</p>

<p><strong>I will not sell or share your personal information with third parties for marketing or advertising purposes.</strong></p>

<h2 id="toc_6">Accessing Personal Data</h2>

<p>If you have a registered account, you are entitled to request a document of your personal information. Request this by contacting me at support@daniel-stone.uk</p>

<h2 id="toc_7">Account Deletion</h2>

<p>You can delete your account and data about you that&rsquo;s stored on the system by contacting me@daniel-stone.uk. In the case you do delete your account, you will need to go through the setup process again in case you change your mind. This process is destructive and non-reversible.</p>

<h2 id="toc_8">Changes to the policy</h2>

<p>Choose When may periodically update this policy. When there is a significant change, I will notify users through the website in the form of a message. The version of this privacy policy can be seen at the top.</p>

<h3 id="toc_9">Endnotes</h3>

<p>I have written this privacy policy with a very limited understanding of the law, therefore if there are any sections that require clarification please contact me at support@daniel-stone.uk</p>
</div>  
</div>
`,
  styles: []
})
export class PrivacyPolicyComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
