import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7672263257:AAGCAX43la2kRnpMoL42GBln2ee3l_A2B_I";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1002667434309";

function formatMessage(type: string, formData: any): string {
  const purposeMap: Record<string, string> = {
    university: "Germaniya universitetlariga kirish",
    work: "Germaniyada ishlash",
    other: "Boshqa maqsadlar"
  };

  const attendMap: Record<string, string> = {
    yes: "Ha, albatta",
    maybe: "Sal uzoqroq, lekin qatnab o'qiy olaman",
    no: "Yo'q, Toshkentda yashamayman"
  };

  const planMap: Record<string, string> = {
    yes: "Ha, aniq rejam bor",
    maybe: "Hali qaror qabul qilmaganman",
    no: "Yo'q, boshqa oyda topshiraman"
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
    return `🎓 Yangi kurs so'rovi\n\n` +
      `👤 Ism: ${formData.name}\n` +
      `📱 Tel: ${formData.phone}\n` +
      `🎯 Maqsad: ${purposeMap[formData.purpose] || formData.purpose}\n` +
      `✅ Qatnashi: ${attendMap[formData.canAttend] || formData.canAttend}\n\n` +
      `📅 Vaqt: ${timestamp}`;
  }

  return `📝 Yangi imtihon so'rovi\n\n` +
    `👤 Ism: ${formData.name}\n` +
    `📱 Tel: ${formData.phone}\n` +
    `📊 Daraja: ${formData.level}\n` +
    `✅ Reja: ${planMap[formData.planToTake] || formData.planToTake}\n` +
    `🏃 Qatnashi: ${attendMap[formData.canAttend] || formData.canAttend}\n\n` +
    `📅 Vaqt: ${timestamp}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set Content-Type header first, before any response
  res.setHeader('Content-Type', 'application/json');

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      success: true,
      message: 'Preflight request successful'
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Parse request body
    let body;
    try {
      body = req.body;
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body'
      });
    }

    // Validate request body
    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'Request body is required'
      });
    }

    const { type, formData } = body;

    // Validate required fields
    if (!type || !formData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type or formData'
      });
    }

    if (!formData.name || !formData.phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name or phone'
      });
    }

    // Format message for Telegram
    const message = formatMessage(type, formData);
    
    // Send to Telegram
    let telegramResponse;
    try {
      telegramResponse = await fetch(
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
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send message to Telegram',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Parse Telegram response
    let telegramData;
    try {
      telegramData = await telegramResponse.json();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to parse Telegram response',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check Telegram API response
    if (!telegramResponse.ok || !telegramData.ok) {
      return res.status(500).json({
        success: false,
        error: 'Telegram API error',
        details: telegramData.description || 'Unknown error'
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "So'rovingiz muvaffaqiyatli yuborildi!"
    });

  } catch (error) {
    // Log error for debugging
    console.error('API error:', error);

    // Return proper JSON error response
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}