import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple health check
  if (req.url === '/api/health') {
    return res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
  }

  // For now, return empty arrays for data endpoints to prevent frontend crashes
  const path = req.url || '';
  
  if (path.includes('/api/transactions')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/quests')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/badges')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/goals')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/stash')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/streak')) {
    return res.status(200).json({ saveStreak: 0, fightStreak: 0 });
  }
  
  if (path.includes('/api/auth/user')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Default response
  return res.status(200).json({ 
    message: 'API endpoint', 
    path: req.url,
    note: 'This is a temporary handler. Full functionality coming soon.'
  });
}
