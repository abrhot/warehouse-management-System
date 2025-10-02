import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  
  console.log(`[Debug] AuthToken exists: ${!!token}`);
  
  if (!token) {
    return NextResponse.json({
      success: false,
      message: 'No authToken found',
      cookies: request.cookies.getAll()
    });
  }

  try {
    // Try JWT verification
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
    const { payload } = await jwtVerify(token, secret);
    
    return NextResponse.json({
      success: true,
      message: 'JWT verification successful',
      payload: payload,
      tokenPreview: token.substring(0, 50) + '...'
    });
  } catch (jwtError) {
    console.log(`[Debug] JWT verification failed:`, jwtError);
    
    // Try base64 decoding
    try {
      const decoded = JSON.parse(atob(token));
      return NextResponse.json({
        success: true,
        message: 'Base64 decoding successful',
        decoded: decoded,
        tokenPreview: token.substring(0, 50) + '...'
      });
    } catch (base64Error) {
      return NextResponse.json({
        success: false,
        message: 'Both JWT and base64 decoding failed',
        jwtError: (jwtError as Error).message,
        base64Error: (base64Error as Error).message,
        tokenPreview: token.substring(0, 50) + '...'
      });
    }
  }
}
