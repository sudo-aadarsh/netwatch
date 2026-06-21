import os

with open('main.py', 'r') as f:
    content = f.read()

# Add imports
if 'from fastapi.staticfiles import StaticFiles' not in content:
    content = content.replace(
        'from fastapi import FastAPI, WebSocket, WebSocketDisconnect',
        'from fastapi import FastAPI, WebSocket, WebSocketDisconnect\nfrom fastapi.staticfiles import StaticFiles\nfrom fastapi.responses import FileResponse\nimport os'
    )

# Add mount and catch-all route at the bottom
static_serve_code = '''
# Serve compiled React frontend
frontend_dist = os.path.join(os.path.dirname(__file__), "frontend", "dist")

if os.path.isdir(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path == "" or full_path == "/":
            return FileResponse(os.path.join(frontend_dist, "index.html"))
        
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Fallback to index.html for SPA routing
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":'''

content = content.replace('if __name__ == "__main__":', static_serve_code)

with open('main.py', 'w') as f:
    f.write(content)
