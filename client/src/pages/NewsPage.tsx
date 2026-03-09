import React, { useMemo, useState, useEffect } from "react";
import { useUIStore } from "@/store/ui.store";
import { newsFeed } from "@/services/news/news-feed";

interface NewsItem {
  title: string;
  contentSnippet: string;
  link: string;
  publishedDate: string; 
  source: string;
}

interface NewsCardProps {
  title: string;
  contentSnippet: string;
  link: string;
  publishedDate: string;
  source: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, contentSnippet, link, publishedDate, source }) => {
  return (
    <div
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        transition: "all 0.15s ease",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-primary)")}

      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div
        style={{
          fontSize: "10px",
          color: "var(--text-primary)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontFamily: "var(--font-mono)",
        }}
      >
        {source} . {publishedDate}
      </div>
      <div>
        <a href={link} 
        target="_blank"       //OPEN IN NEW TAB
        rel="noopener noreferrer"
        style={{
          fontWeight: "700",
          fontSize: "17px",
          color: "var(--gold)",
          fontFamily: "var(--font-mono)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration= "underline 1px var(--gold)")}

        onMouseLeave={(e) => (e.currentTarget.style.textDecoration="none")}>
            {title}</a>
      </div>
        <div
        style={{
          fontSize: "10px",
          color: "var(--text-primary)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontFamily: "var(--font-mono)",
        }}
      >
        {contentSnippet}
      </div>
    </div>
  );
};

export function MarketNewsPage() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const token = useUIStore((s) => s.token);

  const [newsData, setNewsdata] = useState<NewsItem[]>([]);

  useEffect(() => {
    const newsConfig = async () => {
      try {
        const authToken = token || sessionStorage.getItem("auth-token");
        if (authToken) {
          const data = await newsFeed(authToken);
          
          setNewsdata(data);
        }
      } catch (err) {
        console.error("Failed to fetch News", err);
      }
    };
    newsConfig();
  }, [token]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px", background: "var(--bg-main)" }}>
      
      {/* HEADER SECTION */}
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start",
        marginBottom: "40px",
      }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "700", color: "var(--text-primary)",  margin: 0 }}>
            Market News
          </h2>
        </div>

        <button 
          onClick={() => setActiveTab("dashboard")} 
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            borderRadius: "var(--radius)",
            padding: "8px 20px",
            fontFamily: "var(--font-mono)", 
            fontSize: "12px", 
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--text-muted)"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
        >
          BACK
        </button>
      </div>

      {/* DATA SECTION */}
      {newsData.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "100px 0",
          color: "var(--text-muted)", fontFamily: "var(--font-mono)",
        }}>
          <div style={{ fontSize: "14px" }}>No News available</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            
              {newsData.map((n) => (
                <NewsCard title={n.title} source={n.source} publishedDate={n.publishedDate} link={n.link} contentSnippet={n.contentSnippet} />
              ))}

        </div>
      )}
    </div>
  );
}