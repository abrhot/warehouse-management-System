import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cookies = req.headers.get('cookie') || '';
  
  // Parse cookies
  const cookieObj: Record<string, string> = {};
  cookies.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      cookieObj[key] = value;
    }
  });

  return NextResponse.json({
    success: true,
    cookies: cookieObj,
    hasAuthToken: !!cookieObj.authToken,
    authToken: cookieObj.authToken || null,
    allCookies: cookies,
    headers: Object.fromEntries(req.headers.entries())
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Create a test response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'Test cookie set',
      receivedData: body
    });
    
    // Set test cookie
    response.cookies.set('authToken', 'test-token-value', {
      path: '/',
      maxAge: 86400, // 24 hours
      httpOnly: false, // Allow JavaScript access for testing
      secure: false // Allow over HTTP for localhost
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
