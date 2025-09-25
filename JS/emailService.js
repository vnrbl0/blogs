// Email Service using EmailJS
// Configuration for sending email notifications

class EmailNotificationService {
    constructor() {
        // EmailJS configuration - You'll need to set these up at https://www.emailjs.com/
        this.SERVICE_ID = 'service_vnr_blog';  // Replace with your EmailJS service ID
        this.CONTACT_TEMPLATE_ID = 'template_contact';  // Replace with your contact template ID
        this.COMMENT_TEMPLATE_ID = 'template_comment';  // Replace with your comment template ID
        this.PUBLIC_KEY = 'dc0SSGDuUj1qKIP-6';  // Replace with your EmailJS public key
        
        // Your email address
        this.ADMIN_EMAIL = 'grindwithmt@gmail.com';
        
        // Initialize EmailJS when the ser  vice is created
        this.initializeEmailJS();
    }
    
    initializeEmailJS() {
        try {
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.PUBLIC_KEY);
                console.log('EmailJS initialized successfully');
            } else {
                console.warn('EmailJS not loaded yet, will retry...');
                // Retry after a short delay
                setTimeout(() => this.initializeEmailJS(), 1000);
            }
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    }
    
    /**
     * Send email notification for new comment
     * @param {Object} commentData - The comment data
     * @param {string} postTitle - The title of the blog post
     * @param {string} postUrl - The URL of the blog post
     */
    async sendCommentNotification(commentData, postTitle, postUrl) {
        try {
            const templateParams = {
                to_email: this.ADMIN_EMAIL,
                from_name: 'VNR Blog System',
                subject: `New Comment on: ${postTitle}`,
                post_title: postTitle,
                post_url: window.location.href,
                commenter_name: commentData.name,
                commenter_email: commentData.email,
                comment_message: commentData.message,
                comment_date: new Date(commentData.timestamp).toLocaleString(),
                notification_type: 'New Comment'
            };
            
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.COMMENT_TEMPLATE_ID,
                templateParams
            );
            
            console.log('Comment notification sent successfully:', response);
            return { success: true, response };
            
        } catch (error) {
            console.error('Failed to send comment notification:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Send email notification for contact form submission
     * @param {Object} contactData - The contact form data
     */
    async sendContactNotification(contactData) {
        try {
            const templateParams = {
                to_email: this.ADMIN_EMAIL,
                from_name: 'VNR Blog Contact Form',
                subject: `New Contact Message: ${contactData.subject}`,
                sender_name: contactData.name,
                sender_email: contactData.email,
                message_subject: contactData.subject,
                message_content: contactData.message,
                submission_date: new Date().toLocaleString(),
                notification_type: 'Contact Form',
                newsletter_subscribe: contactData.newsletter ? 'Yes' : 'No'
            };
            
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.CONTACT_TEMPLATE_ID,
                templateParams
            );
            
            console.log('Contact notification sent successfully:', response);
            return { success: true, response };
            
        } catch (error) {
            console.error('Failed to send contact notification:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Test email service connection
     */
    async testEmailService() {
        try {
            const testParams = {
                to_email: this.ADMIN_EMAIL,
                from_name: 'VNR Blog System',
                subject: 'Email Service Test',
                message: 'This is a test email to verify the email service is working correctly.',
                test_date: new Date().toLocaleString()
            };
            
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.CONTACT_TEMPLATE_ID,
                testParams
            );
            
            console.log('Test email sent successfully:', response);
            return { success: true, response };
            
        } catch (error) {
            console.error('Test email failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get email service status
     */
    getServiceStatus() {
        return {
            initialized: typeof emailjs !== 'undefined',
            serviceId: this.SERVICE_ID,
            adminEmail: this.ADMIN_EMAIL,
            templatesConfigured: {
                contact: !!this.CONTACT_TEMPLATE_ID,
                comment: !!this.COMMENT_TEMPLATE_ID
            }
        };
    }
    
    /**
     * Update configuration (for development/testing)
     */
    updateConfig(config) {
        if (config.SERVICE_ID) this.SERVICE_ID = config.SERVICE_ID;
        if (config.CONTACT_TEMPLATE_ID) this.CONTACT_TEMPLATE_ID = config.CONTACT_TEMPLATE_ID;
        if (config.COMMENT_TEMPLATE_ID) this.COMMENT_TEMPLATE_ID = config.COMMENT_TEMPLATE_ID;
        if (config.PUBLIC_KEY) {
            this.PUBLIC_KEY = config.PUBLIC_KEY;
            this.initializeEmailJS();
        }
        if (config.ADMIN_EMAIL) this.ADMIN_EMAIL = config.ADMIN_EMAIL;
        
        console.log('Email service configuration updated');
    }
}

// Create global instance
window.emailNotificationService = new EmailNotificationService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailNotificationService;
}