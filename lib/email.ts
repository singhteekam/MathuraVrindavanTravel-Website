import nodemailer from 'nodemailer'
import { siteConfig } from '@/config/site'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Generic send
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  return transporter.sendMail({
    from:    process.env.EMAIL_FROM ?? `${siteConfig.name} <info@mathuravrindavantravel.com>`,
    to,
    subject,
    html,
  })
}

// Booking confirmation to customer
export async function sendBookingConfirmation(booking: {
  bookingId: string
  customerName: string
  customerEmail: string
  carName: string
  startDate: string
  pickupLocation: string
  totalAmount: number
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ff7d0f, #c74a06); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed! 🙏</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Jai Shri Krishna</p>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; color: #374151;">Dear <strong>${booking.customerName}</strong>,</p>
        <p style="color: #6b7280;">Your Mathura Vrindavan tour has been confirmed! Here are your booking details:</p>
        <div style="background: #fff8ed; border: 1px solid #ffdba8; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Booking ID</td><td style="padding: 8px 0; font-weight: bold; color: #ff7d0f; text-align: right;">${booking.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Vehicle</td><td style="padding: 8px 0; font-weight: 600; color: #111827; text-align: right;">${booking.carName}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Travel Date</td><td style="padding: 8px 0; font-weight: 600; color: #111827; text-align: right;">${booking.startDate}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pickup Location</td><td style="padding: 8px 0; font-weight: 600; color: #111827; text-align: right;">${booking.pickupLocation}</td></tr>
            <tr style="border-top: 1px solid #ffdba8;"><td style="padding: 12px 0 0; color: #374151; font-weight: bold;">Total Amount</td><td style="padding: 12px 0 0; font-weight: bold; color: #ff7d0f; font-size: 18px; text-align: right;">₹${booking.totalAmount.toLocaleString('en-IN')}</td></tr>
          </table>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Our team will call you within 30 minutes to confirm driver details. For any queries, call or WhatsApp us at <strong>${siteConfig.phone}</strong>.</p>
        <p style="color: #374151; font-size: 14px; margin-top: 20px;">Jai Shri Krishna 🙏<br><strong>${siteConfig.name}</strong></p>
      </div>
    </div>
  `
  return sendEmail({ to: booking.customerEmail, subject: `Booking Confirmed — ${booking.bookingId} | Mathura Vrindavan Travel`, html })
}

// New enquiry notification to admin
export async function sendEnquiryNotification(contact: {
  name: string
  phone: string
  email?: string
  message: string
  tourDate?: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #ff7d0f;">New Enquiry Received 📩</h2>
      <table style="width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 8px; padding: 20px;">
        <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Name</td><td style="padding: 8px; color: #6b7280;">${contact.name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Phone</td><td style="padding: 8px; color: #6b7280;">${contact.phone}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Email</td><td style="padding: 8px; color: #6b7280;">${contact.email ?? 'Not provided'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Tour Date</td><td style="padding: 8px; color: #6b7280;">${contact.tourDate ?? 'Not specified'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #374151; vertical-align: top;">Message</td><td style="padding: 8px; color: #6b7280;">${contact.message}</td></tr>
      </table>
    </div>
  `
  return sendEmail({
    to:      process.env.SMTP_USER ?? siteConfig.email,
    subject: `New Enquiry from ${contact.name} — Mathura Vrindavan Travel`,
    html,
  })
}