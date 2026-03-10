import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MarketNewsPage } from "../src/pages/NewsPage";
import { newsFeed } from "../src/services/news/news-feed";
import { useUIStore } from "../src/store/ui.store";

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
    (useUIStore as any).mockImplementation((selector: any) => 
      selector({ 
        token: "test-token", 
        setActiveTab: mockedSetActiveTab 
      })
    );
    Storage.prototype.getItem = jest.fn(() => "test-token");
  });

  it("renders news items correctly on successful fetch", async () => {
    mockedNewsFeed.mockResolvedValueOnce(mockNewsData);

    render(<MarketNewsPage />);

    // findByText handles the act() wrapping and wait logic automatically
    const title = await screen.findByText(/Market Hits All Time High/i);
    expect(title).toBeInTheDocument();

    // Matching split text using regex
    expect(screen.getByText(/Reuters/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-03-20/i)).toBeInTheDocument();

    const newsLink = screen.getByRole("link", { name: /Market Hits All Time High/i });
    expect(newsLink).toHaveAttribute("href", "https://finance.com/news1");
  });

  it("shows 'No News available' when the list is empty", async () => {
    mockedNewsFeed.mockResolvedValueOnce([]);
    render(<MarketNewsPage />);

    expect(await screen.findByText(/No News available/i)).toBeInTheDocument();
  });

  it("calls setActiveTab when BACK button is clicked", async () => {
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

  it("handles hover effects on NewsCard", async () => {
    mockedNewsFeed.mockResolvedValueOnce(mockNewsData);
    render(<MarketNewsPage />);

    const link = await screen.findByText(/Market Hits All Time High/i);
    
    fireEvent.mouseEnter(link);
    expect(link.style.textDecoration).toContain("underline");

    fireEvent.mouseLeave(link);
    expect(link.style.textDecoration).toBe("none");
  });
});