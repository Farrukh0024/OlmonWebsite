import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "7672263257:AAGCAX43la2kRnpMoL42GBln2ee3l_A2B_I";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") || "-1002034394857";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

function formatCourseMessage(data: CourseFormData): string {
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

  return `🎓 Yangi kurs so'rovi:

👤 Ism: ${sanitizeInput(data.name)}
📱 Telefon: ${sanitizeInput(data.phone)}
🎯 Maqsad: ${purposeMap[data.purpose as keyof typeof purposeMap] || data.purpose}
🏃 Qatnay olishi: ${attendMap[data.canAttend as keyof typeof attendMap] || data.canAttend}

📅 Vaqt: ${new Date().toLocaleString('uz-UZ')}`;
}

function formatExamMessage(data: ExamFormData): string {
  const planMap = {
    yes: "Ha, aniq rejam bor",
    maybe: "Hali qaror qabul qilmaganman",
    no: "Yo'q, boshqa oyda topshiraman",
  };

  const attendMap = {
    yes: "Ha, albatta",
    no: "Yo'q, kela olmiman",
  };

  return `📝 Yangi imtihon so'rovi:

👤 Ism: ${sanitizeInput(data.name)}
📱 Telefon: ${sanitizeInput(data.phone)}
📊 Daraja: ${sanitizeInput(data.level)}
✅ Topshirish rejasi: ${planMap[data.planToTake as keyof typeof planMap] || data.planToTake}
🏃 Qatnay olishi: ${attendMap[data.canAttend as keyof typeof attendMap] || data.canAttend}

📅 Vaqt: ${new Date().toLocaleString('uz-UZ')}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, formData } = await req.json();

    // Validate required fields
    if (!formData.name || !formData.phone) {
      return new Response(
        JSON.stringify({ error: 'Ism va telefon raqam kiritish majburiy' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone number
    if (!isValidPhoneNumber(formData.phone)) {
      return new Response(
        JSON.stringify({ error: 'Noto\'g\'ri telefon raqam formati' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const message = type === 'course' 
      ? formatCourseMessage(formData as CourseFormData)
      : formatExamMessage(formData as ExamFormData);

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Xatolik yuz berdi' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});