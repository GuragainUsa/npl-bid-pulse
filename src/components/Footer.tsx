import { ExternalLink, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          {/* Left - Medium Link */}
          <div className="flex items-center gap-2">
            <span>Developer:</span>
            <a 
              href="https://medium.com/@pg22021321" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              Praebesh Guragain
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Middle - Name and Twitter */}
          <div className="flex items-center gap-4">
            <span>Praebesh Guragain</span>
            <a 
              href="https://x.com/prabeshguragai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <Twitter className="w-4 h-4" />
              @praebeshguragain
            </a>
          </div>

          {/* Right - YouTube Live */}
          <div className="flex items-center gap-2">
            <a 
              href="https://youtube.com/live" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <Youtube className="w-4 h-4" />
              Live Stream
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
