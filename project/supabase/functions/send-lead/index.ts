import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = "7672263257:AAGCAX43la2kRnpMoL42GBln2ee3l_A2B_I";
const TELEGRAM_CHAT_ID = "-1002667434309";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

interface CourseFormData {
  purpose: string;
  canAttend: string;
  name: string;
  phone: string;
}

interface ExamFormData {
  planToTake: string;
  canAttend: string;
  level: string;
  name: string;
  phone: string;
}

function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
  return phoneRegex.test(phone);
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>&]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      default: return char;
    }
  });
}

function formatMessage(type: string, formData: CourseFormData | ExamFormData): string {
  const purposeMap = {
    university: "Germaniya universitetlariga kirish",
    work: "Germaniyada ishlash",
    other: "Boshqa maqsadlar",
  };

  const attendMap = {
    yes: "Ha, albatta",
    maybe: "Sal uzoqroq, lekin qatnab o'qiy olaman",
    no: "Yo'q, Toshkentda yashamayman",
  };

  const planMap = {
    yes: "Ha, aniq rejam bor",
    maybe: "Hali qaror qabul qilmaganman",
    no: "Yo'q, boshqa oyda topshiraman",
  };

  const timestamp = new Date().toLocaleString('uz-UZ', { 
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (type === 'course') {
    const courseData = formData as CourseFormData;
    return `🎓 Yangi kurs so'rovi\n\n` +
      `👤 Ism: ${sanitizeInput(courseData.name)}\n` +
      `📱 Tel: ${sanitizeInput(courseData.phone)}\n` +
      `🎯 Maqsad: ${purposeMap[courseData.purpose as keyof typeof purposeMap] || courseData.purpose}\n` +
      `✅ Qatnashi: ${attendMap[courseData.canAttend as keyof typeof attendMap] || courseData.canAttend}\n\n` +
      `📅 Vaqt: ${timestamp}`;
  }

  const examData = formData as ExamFormData;
  return `📝 Yangi imtihon so'rovi\n\n` +
    `👤 Ism: ${sanitizeInput(examData.name)}\n` +
    `📱 Tel: ${sanitizeInput(examData.phone)}\n` +
    `📊 Daraja: ${sanitizeInput(examData.level)}\n` +
    `✅ Reja: ${planMap[examData.planToTake as keyof typeof planMap] || examData.planToTake}\n` +
    `🏃 Qatnashi: ${attendMap[examData.canAttend as keyof typeof attendMap] || examData.canAttend}\n\n` +
    `📅 Vaqt: ${timestamp}`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      throw new Error('Invalid request body');
    }

    const { type, formData } = body;

    // Validate required fields
    if (!formData || !type) {
      throw new Error('Missing required fields');
    }

    if (!formData.name || !formData.phone) {
      throw new Error('Name and phone are required');
    }

    // Validate phone number
    if (!isValidPhoneNumber(formData.phone)) {
      throw new Error('Invalid phone number format');
    }

    // Format message for Telegram
    const message = formatMessage(type, formData);
    
    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }
    );

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text();
      throw new Error(`Telegram API error: ${telegramError}`);
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "So'rovingiz muvaffaqiyatli yuborildi!"
      }), 
      { headers: corsHeaders }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }), 
      { 
        status: error instanceof Error && error.message === 'Method not allowed' ? 405 : 400,
        headers: corsHeaders 
      }
    );
  }
});