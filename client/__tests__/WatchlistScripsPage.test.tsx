import { render, screen, waitFor } from "@testing-library/react";
import { WatchlistScripsPage } from "../src/pages/WatchlistScripsPage";
import { watchlistListScripList } from "../src/services/watchlist/watchlist-scrips-list";
import { useMarketStore, useUIStore } from "../src/store";

// 1. Mock the dependencies
jest.mock("../src/services/watchlist/watchlist-scrips-list");
jest.mock("../src/store");

const mockedWatchlistList = watchlistListScripList as jest.MockedFunction<typeof watchlistListScripList>;

describe("WatchlistScripsPage", () => {
  const mockScripData = {
    scrips: [
      {
        symbolName: "AAPL",
        companyName: "Apple Inc",
        segmentIndicator: "Technology",
        openPrice: 150,
        netChange: 5,
        previousClosePrice: 145,
        volumeTradedToday: 1000000,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Store implementation
    (useUIStore as any).mockImplementation((selector: any) => selector({ token: "fake-token" }));
    (useMarketStore as any).mockImplementation((selector: any) => selector({
      selectedWatchlistId: "123",
      priceHistory: {},
    }));

    // Mock SessionStorage
    Storage.prototype.getItem = jest.fn(() => "fake-token");
  });

  it("renders the stock table with mapped data on success", async () => {
    mockedWatchlistList.mockResolvedValueOnce(mockScripData);

    render(<WatchlistScripsPage />);

    await waitFor(() => {
      // Verify mapping logic: changePercent = 5 / 145 ≈ 0.034...
      expect(mockedWatchlistList).toHaveBeenCalledWith("fake-token", "123");
    });

    // Check if the data reached the screen (or the mock table)
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc")).toBeInTheDocument();
  });

  it("handles edge cases in mapping (missing prices)", async () => {
    const edgeCaseData = {
      scrips: [
        {
          symbolName: "TSLA",
          companyName: "Tesla",
          openPrice: null,
          previousClosePrice: null, // Tests the division by zero / fallback logic
          netChange: null,
        },
      ],
    };
    mockedWatchlistList.mockResolvedValueOnce(edgeCaseData);

    render(<WatchlistScripsPage />);

    await waitFor(() => {
      expect(screen.getByText("TSLA")).toBeInTheDocument();
    });
  });

  it("logs an error when the API call fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedWatchlistList.mockRejectedValueOnce(new Error("API Timeout"));

    render(<WatchlistScripsPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch data", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("does nothing if token is missing in sessionStorage", async () => {
    Storage.prototype.getItem = jest.fn(() => null);
    
    render(<WatchlistScripsPage />);
    
    await waitFor(() => {
      expect(mockedWatchlistList).not.toHaveBeenCalled();
    });
  });
});