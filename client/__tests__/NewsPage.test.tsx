import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MarketNewsPage } from "../src/pages/NewsPage";
import { newsFeed } from "../src/services/news/news-feed";
import { useUIStore } from "../src/store/ui.store";

// 1. Mock dependencies
jest.mock("../src/services/news/news-feed");
jest.mock("../src/store/ui.store");

const mockedNewsFeed = newsFeed as jest.MockedFunction<typeof newsFeed>;
const mockedSetActiveTab = jest.fn();

describe("MarketNewsPage", () => {
  const mockNewsData = [
    {
      title: "Market Hits All Time High",
      contentSnippet: "Stocks surged today...",
      link: "https://finance.com/news1",
      publishedDate: "2024-03-20",
      source: "Reuters",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Zustand store implementation
    (useUIStore as any).mockImplementation((selector: any) => 
      selector({ 
        token: "test-token", 
        setActiveTab: mockedSetActiveTab 
      })
    );

    // Mock SessionStorage
    Storage.prototype.getItem = jest.fn(() => "test-token");
  });

  it("renders news items correctly on successful fetch", async () => {
    mockedNewsFeed.mockResolvedValueOnce(mockNewsData);

    render(<MarketNewsPage />);

    // Check if header is present
    expect(screen.getByText("Market News")).toBeInTheDocument();

    // Wait for the async mapping and render
    await waitFor(() => {
      expect(screen.getByText("Market Hits All Time High")).toBeInTheDocument();
      expect(screen.getByText("REUTERS . 2024-03-20")).toBeInTheDocument();
    });

    const newsLink = screen.getByRole("link", { name: /Market Hits All Time High/i });
    expect(newsLink).toHaveAttribute("href", "https://finance.com/news1");
    expect(newsLink).toHaveAttribute("target", "_blank");
  });

  it("shows 'No News available' when the list is empty", async () => {
    mockedNewsFeed.mockResolvedValueOnce([]);

    render(<MarketNewsPage />);

    await waitFor(() => {
      expect(screen.getByText("No News available")).toBeInTheDocument();
    });
  });

  it("calls setActiveTab when BACK button is clicked", () => {
    mockedNewsFeed.mockResolvedValueOnce([]);
    render(<MarketNewsPage />);

    const backButton = screen.getByText("BACK");
    fireEvent.click(backButton);

    expect(mockedSetActiveTab).toHaveBeenCalledWith("dashboard");
  });

  it("handles API failure gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedNewsFeed.mockRejectedValueOnce(new Error("Network Error"));

    render(<MarketNewsPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch News", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("handles hover effects on NewsCard (Coverage for style logic)", () => {
    mockedNewsFeed.mockResolvedValueOnce(mockNewsData);
    render(<MarketNewsPage />);

    // Find the link inside the card
    const link = screen.getByText("Market Hits All Time High");
    
    // Trigger Mouse Enter
    fireEvent.mouseEnter(link);
    expect(link.style.textDecoration).toContain("underline");

    // Trigger Mouse Leave
    fireEvent.mouseLeave(link);
    expect(link.style.textDecoration).toBe("none");
  });
});