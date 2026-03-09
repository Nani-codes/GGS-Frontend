import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = String(formData.get('name') || '').trim();
    const number = String(formData.get('number') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const cv = formData.get('cv') as File | null;
    const cvLink = String(formData.get('cvLink') || '').trim();

    const errors: Record<string, string> = {};

    if (!name) {
      errors.name = 'Name is required';
    }
    if (!number) {
      errors.number = 'Number is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (!cv && !cvLink) {
      errors.cv = 'Please upload your CV or provide a CV link';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const careerEmailTo = process.env.CAREER_EMAIL_TO || 'info@greengoldseeds.co.in';

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('[Careers] SMTP configuration is missing');
      return NextResponse.json(
        {
          success: false,
          message:
            'Email service is not configured. Please try again later.',
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const subject = `New Career Application from ${name}`;

    const htmlBody = `
      <h2>New Career Application</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Number:</strong> ${number}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Address:</strong> ${address || 'N/A'}</p>
      <p><strong>CV Link:</strong> ${cvLink ? `<a href="${cvLink}" target="_blank" rel="noopener noreferrer">${cvLink}</a>` : 'Not provided'}</p>
    `;

    const attachments = [] as { filename: string; content: Buffer }[];

    if (cv instanceof File) {
      const arrayBuffer = await cv.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      attachments.push({
        filename: cv.name || 'cv.pdf',
        content: buffer,
      });
    }

    try {
      await transporter.sendMail({
        from: smtpUser,
        to: careerEmailTo,
        subject,
        html: htmlBody,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    } catch (emailError) {
      console.error('[Careers] Failed to send email', emailError);
      return NextResponse.json(
        {
          success: false,
          message:
            'There was an error sending your application email. Please try again later.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Careers] Error handling application', err);
    return NextResponse.json(
      {
        success: false,
        message:
          'There was an error processing your application. Please try again later.',
      },
      { status: 500 }
    );
  }
}

