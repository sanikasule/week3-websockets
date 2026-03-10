import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WatchlistPage } from "../src/features/dashboard/WatchlistPage";
import { useUIStore } from "../src/store/ui.store";
import { useMarketStore } from "../src/store/market.store";
import { watchlistList } from "../src/services/watchlist/watchlist-list";

// 1. Mock the external dependencies
jest.mock("../src/store/ui.store");
jest.mock("../src/store/market.store");
jest.mock("../src/services/watchlist/watchlist-list");

const mockedWatchlistList = watchlistList as jest.MockedFunction<typeof watchlistList>;
const mockedUseUIStore = useUIStore as unknown as jest.Mock;
const mockedUseMarketStore = useMarketStore as unknown as jest.Mock;

describe("WatchlistPage", () => {
  const mockSetActiveTab = jest.fn();
  const mockSetWatchlistId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations for stores
    mockedUseUIStore.mockImplementation((selector: any) => selector({
      token: "fake-token",
      setActiveTab: mockSetActiveTab,
    }));

    mockedUseMarketStore.mockImplementation((selector: any) => selector({
      setWatchlistId: mockSetWatchlistId,
    }));

    // Mock session storage
    Storage.prototype.getItem = jest.fn(() => "fake-token");
  });

  it("renders the loading/empty state initially", async () => {
    mockedWatchlistList.mockResolvedValueOnce({
      userDefinedWatchlists: [],
      predefinedWatchlists: [],
      defaultWatchlistId: null,
    });

    render(<WatchlistPage />);

    expect(screen.getByText(/Your Watchlists/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/No watchlists found/i)).toBeInTheDocument();
    });
  });

  it("renders watchlists fetched from the service", async () => {
    const mockData = {
      userDefinedWatchlists: [{ watchlistName: "My Crypto", watchlistId: 101 }],
      predefinedWatchlists: [{ watchlistName: "Tech Stocks", watchlistId: 202 }],
      defaultWatchlistId: 101,
    };
    mockedWatchlistList.mockResolvedValueOnce(mockData);

    render(<WatchlistPage />);

    // Check if both list items appear
    await waitFor(() => {
      expect(screen.getByText("My Crypto")).toBeInTheDocument();
      expect(screen.getByText("Tech Stocks")).toBeInTheDocument();
    });

    // Check if DEFAULT badge appears on the correct one
    expect(screen.getByText("DEFAULT")).toBeInTheDocument();
    expect(screen.getByText("ID: #101")).toBeInTheDocument();
  });

  it("navigates back to dashboard when BACK button is clicked", () => {
    mockedWatchlistList.mockResolvedValueOnce({ userDefinedWatchlists: [], predefinedWatchlists: [] });
    
    render(<WatchlistPage />);
    const backButton = screen.getByText(/BACK/i);
    fireEvent.click(backButton);

    expect(mockSetActiveTab).toHaveBeenCalledWith("dashboard");
  });

  it("sets watchlist ID and switches tab when 'View Assets' is clicked", async () => {
    mockedWatchlistList.mockResolvedValueOnce({
      userDefinedWatchlists: [{ watchlistName: "Gold", watchlistId: 55 }],
      predefinedWatchlists: [],
    });

    render(<WatchlistPage />);

    const viewAssetsBtn = await screen.findByText(/View Assets/i);
    fireEvent.click(viewAssetsBtn);

    expect(mockSetWatchlistId).toHaveBeenCalledWith(55);
    expect(mockSetActiveTab).toHaveBeenCalledWith("watchlist-detail");
  });
});