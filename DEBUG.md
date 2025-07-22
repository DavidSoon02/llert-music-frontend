# 🔧 Service Connection Debug Guide

## Problem: Timeout errors when fetching songs

The error `timeout of 10000ms exceeded` indicates that the frontend cannot connect to the backend services.

## Quick Diagnostics

1. **Check Service Debug Panel**
   - Look for the blue 🔧 button in the bottom-left corner (development only)
   - Click it and then "Check All" to test all service connections
   - Red ❌ = Service down or unreachable
   - Green ✅ = Service responding correctly

2. **Common Issues**

### ❌ Service URLs not configured
```bash
# Check your .env.local file has these variables:
VITE_LOGIN_SERVICE_URL=http://13.218.201.222:3001
VITE_REGISTER_SERVICE_URL=http://13.218.201.222:3001
VITE_SONG_LIST_SERVICE_URL=http://13.218.201.222:8080
VITE_SONG_ADD_SERVICE_URL=http://13.218.201.222:8080
VITE_SONG_DELETE_SERVICE_URL=http://13.218.201.222:8080
VITE_CART_ADD_SERVICE_URL=http://localhost:8001
VITE_CART_REMOVE_SERVICE_URL=http://localhost:8002
VITE_CART_VIEW_SERVICE_URL=http://localhost:8003
VITE_CLIENT_LIST_SERVICE_URL=http://13.218.201.222:3004
VITE_CLIENT_ADD_SERVICE_URL=http://13.218.201.222:3004
VITE_CLIENT_DELETE_SERVICE_URL=http://13.218.201.222:3004
```

### ❌ Services not running
Make sure these services are started:
- **Song services**: Should be accessible via the load balancer at port 8080
- **Auth services**: Should be running on the AWS instance
- **Cart services**: Should be running locally on ports 8001, 8002, 8003

### ❌ CORS issues
Services need to allow requests from `http://localhost:5173`

### ❌ Network connectivity
Test if you can reach the services directly:
```bash
# Test song service via load balancer
curl http://13.218.201.222:8080/api/songs

# Test auth service
curl http://13.218.201.222:3001/api/auth/health

# Test cart services (if running locally)
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
```

## Solutions

### 1. ✅ If ALL services show "NOT_CONFIGURED"
```bash
# Create or update .env.local in the root directory
cp .env.example .env.local
# Edit .env.local with correct URLs
```

### 2. ✅ If specific services are down
- Check if the service is running
- Verify the port and URL are correct
- Check service logs for errors

### 3. ✅ If timeout persists
- Services might be overloaded
- Check if there are network firewalls blocking access
- Verify the load balancer is distributing requests correctly

### 4. ✅ For cart services specifically
Make sure Redis is running and accessible:
```bash
# Check if Redis is running
redis-cli ping
# Should return "PONG"
```

## Environment Variables Reference

| Variable | Purpose | Expected Value |
|----------|---------|----------------|
| `VITE_LOGIN_SERVICE_URL` | Authentication login | `http://13.218.201.222:3001` |
| `VITE_REGISTER_SERVICE_URL` | User registration | `http://13.218.201.222:3001` |
| `VITE_SONG_LIST_SERVICE_URL` | Browse songs | `http://13.218.201.222:8080` |
| `VITE_SONG_ADD_SERVICE_URL` | Add new songs | `http://13.218.201.222:8080` |
| `VITE_SONG_DELETE_SERVICE_URL` | Delete songs | `http://13.218.201.222:8080` |
| `VITE_CART_ADD_SERVICE_URL` | Add to cart | `http://localhost:8001` |
| `VITE_CART_REMOVE_SERVICE_URL` | Remove from cart | `http://localhost:8002` |
| `VITE_CART_VIEW_SERVICE_URL` | View cart | `http://localhost:8003` |
| `VITE_CLIENT_LIST_SERVICE_URL` | Client management | `http://13.218.201.222:3004` |
| `VITE_CLIENT_ADD_SERVICE_URL` | Add clients | `http://13.218.201.222:3004` |
| `VITE_CLIENT_DELETE_SERVICE_URL` | Delete clients | `http://13.218.201.222:3004` |

## Testing Steps

1. **Start the debug tool**: Look for 🔧 button when running `npm run dev`
2. **Check all services**: Click "Check All" in the debug panel
3. **Identify failing services**: Note which ones show red ❌
4. **Fix configuration**: Update .env.local with correct URLs
5. **Restart development server**: `npm run dev`
6. **Re-test**: Use debug panel again to verify fixes

## Need Help?

If services continue to fail:
1. Check the browser console for detailed error messages
2. Verify the service is actually running on the expected port
3. Test the service URL directly in a browser or with curl
4. Check if there are any firewall or network restrictions
