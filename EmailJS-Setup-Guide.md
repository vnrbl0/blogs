# EmailJS Setup Guide for VNR Blog

This guide will help you configure EmailJS to receive email notifications when users comment on your blog posts or submit messages through your contact form.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In the EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. For Gmail:
   - Service ID: `service_vnr_blog` (or your preferred name)
   - User ID: Your Gmail address (`grindwithmt@gmail.com`)
   - Follow the authentication process to connect your Gmail

## Step 3: Create Email Templates

### Template 1: Comment Notifications

1. Go to "Email Templates" in the dashboard
2. Click "Create New Template"
3. Template ID: `template_comment`
4. Use this template:

```html
Subject: New Comment on: {{post_title}}

From: VNR Blog System
To: {{to_email}}

Hi VNR,

You have received a new comment on your blog post "{{post_title}}".

Comment Details:
- Commenter: {{commenter_name}} ({{commenter_email}})
- Post: {{post_title}}
- Post URL: {{post_url}}
- Date: {{comment_date}}

Comment Message:
{{comment_message}}

---
This is an automated notification from your VNR Blog system.
```

### Template 2: Contact Form Notifications

1. Create another template
2. Template ID: `template_contact`
3. Use this template:

```html
Subject: New Contact Message: {{message_subject}}

From: VNR Blog Contact Form
To: {{to_email}}

Hi VNR,

You have received a new message through your blog contact form.

Contact Details:
- Name: {{sender_name}}
- Email: {{sender_email}}
- Subject: {{message_subject}}
- Date: {{submission_date}}
- Newsletter Subscription: {{newsletter_subscribe}}

Message:
{{message_content}}

---
Reply directly to this email to respond to {{sender_name}}.

This is an automated notification from your VNR Blog contact form.
```

## Step 4: Get Your Configuration Details

From your EmailJS dashboard, collect these details:
- Service ID: `service_vnr_blog`
- Template IDs: `template_comment` and `template_contact`
- Public Key: Found in "Account" > "General" > "Public Key"

## Step 5: Update Your Configuration

Edit the file `JS/emailService.js` and update these values:

```javascript
constructor() {
    // Update these with your actual EmailJS configuration
    this.SERVICE_ID = 'your_service_id_here';
    this.CONTACT_TEMPLATE_ID = 'template_contact';
    this.COMMENT_TEMPLATE_ID = 'template_comment';
    this.PUBLIC_KEY = 'your_public_key_here';
    
    // This is already set correctly
    this.ADMIN_EMAIL = 'grindwithmt@gmail.com';
}
```

## Step 6: Test the Configuration

1. Open your blog in a browser
2. Open the browser's developer console (F12)
3. Navigate to a blog post and try posting a comment
4. Check the console for email notification messages
5. Try the contact form as well

## Example Configuration

Here's what your final configuration should look like:

```javascript
// In JS/emailService.js
constructor() {
    this.SERVICE_ID = 'service_vnr_blog';
    this.CONTACT_TEMPLATE_ID = 'template_contact'; 
    this.COMMENT_TEMPLATE_ID = 'template_comment';
    this.PUBLIC_KEY = 'abcd1234567890xyz'; // Your actual public key
    this.ADMIN_EMAIL = 'grindwithmt@gmail.com';
}
```

## Features Included

### Comment Notifications
- Automatic email when someone comments on any blog post
- Includes commenter details, comment content, and post information
- Sent to `grindwithmt@gmail.com`

### Contact Form Notifications  
- Automatic email when someone submits the contact form
- Includes sender details, message content, and submission time
- Sent to `grindwithmt@gmail.com`

## Troubleshooting

### Common Issues:

1. **Emails not being sent**
   - Check console for errors
   - Verify all configuration values are correct
   - Ensure EmailJS service is connected properly

2. **Template not found errors**
   - Verify template IDs match exactly
   - Check templates are published in EmailJS dashboard

3. **Authentication errors**
   - Verify public key is correct
   - Check service connection in EmailJS dashboard

### Testing Commands

You can test the email service manually in the browser console:

```javascript
// Test comment notification
window.emailNotificationService.sendCommentNotification(
    {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test comment',
        timestamp: new Date().toISOString()
    },
    'Test Blog Post',
    window.location.href
);

// Test contact notification
window.emailNotificationService.sendContactNotification({
    name: 'Test Contact',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test contact message'
});
```

## Security Notes

- Never expose your private keys in client-side code
- EmailJS public keys are safe to use in frontend applications
- The service is rate-limited to prevent abuse
- Your email address is already configured as the recipient

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Templates Guide: https://www.emailjs.com/docs/templates/
- Free tier includes 200 emails per month

Once configured, you'll receive email notifications automatically when users interact with your blog!