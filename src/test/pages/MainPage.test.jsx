/* Copyright (c) 2026 Jema Technology.
   Distributed under the license specified in the root directory of this project. */

// MainPage tests
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MainPage from "../../pages/MainPage.jsx";

describe("MainPage", () => {
  const defaultProps = {
    onSelectFeature: vi.fn(),
    currentTheme: "dark",
    onThemeChange: vi.fn(),
    lang: "en",
    onLangChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("English", () => {
    it("displays all 6 feature cards", () => {
      render(<MainPage {...defaultProps} />);

      expect(screen.getByText("Compress")).toBeInTheDocument();
      expect(screen.getByText("Merge")).toBeInTheDocument();
      expect(screen.getByText("Split")).toBeInTheDocument();
      expect(screen.getByText("Extract Pages")).toBeInTheDocument();
      expect(screen.getByText("Grayscale")).toBeInTheDocument();
      expect(screen.getByText("Resize")).toBeInTheDocument();
    });

    it("displays feature descriptions", () => {
      render(<MainPage {...defaultProps} />);

      expect(screen.getByText("Reduce PDF file size")).toBeInTheDocument();
      expect(screen.getByText("Combine multiple PDFs")).toBeInTheDocument();
      expect(screen.getByText("Split PDF into pages")).toBeInTheDocument();
      expect(screen.getByText("Extract a range of pages")).toBeInTheDocument();
      expect(screen.getByText("Convert to black & white")).toBeInTheDocument();
      expect(screen.getByText("Change page size (A4, Letter...)")).toBeInTheDocument();
    });

    it("displays privacy first message", () => {
      render(<MainPage {...defaultProps} />);
      expect(screen.getByText("Privacy First:")).toBeInTheDocument();
      expect(screen.getByText(/All processing happens in your browser/)).toBeInTheDocument();
    });

    it("displays footer line", () => {
      render(<MainPage {...defaultProps} />);
      expect(screen.getByText((content) => content.includes("Developed by"))).toBeInTheDocument();
      expect(screen.getByText("Jema Technology")).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes("© 2026 • Open Source & Free"))).toBeInTheDocument();
    });

    it("clicking feature card calls onSelectFeature with correct id", () => {
      render(<MainPage {...defaultProps} />);

      fireEvent.click(screen.getByText("Compress"));
      expect(defaultProps.onSelectFeature).toHaveBeenCalledWith("compress");

      fireEvent.click(screen.getByText("Merge"));
      expect(defaultProps.onSelectFeature).toHaveBeenCalledWith("merge");

      fireEvent.click(screen.getByText("Split"));
      expect(defaultProps.onSelectFeature).toHaveBeenCalledWith("split");
    });



    it("renders theme selector", () => {
      render(<MainPage {...defaultProps} />);
      // Theme selector should be present (the component renders a button or select)
      const topBar = document.querySelector(".top-bar");
      expect(topBar).toBeInTheDocument();
    });

    it("renders language selector", () => {
      render(<MainPage {...defaultProps} />);
      // Check for language toggle - it shows "en/fr" combined
      expect(screen.getByText("en/fr")).toBeInTheDocument();
    });
  });

  describe("French", () => {
    const frenchProps = { ...defaultProps, lang: "fr" };

    it("displays all feature cards in French", () => {
      render(<MainPage {...frenchProps} />);

      expect(screen.getByText("Compresser")).toBeInTheDocument();
      expect(screen.getByText("Fusionner")).toBeInTheDocument();
      expect(screen.getByText("Diviser")).toBeInTheDocument();
      expect(screen.getByText("Extraire des pages")).toBeInTheDocument();
      expect(screen.getByText("Niveaux de gris")).toBeInTheDocument();
      expect(screen.getByText("Redimensionner")).toBeInTheDocument();
    });

    it("displays feature descriptions in French", () => {
      render(<MainPage {...frenchProps} />);

      expect(screen.getByText("Réduire la taille du fichier PDF")).toBeInTheDocument();
      expect(screen.getByText("Combiner plusieurs PDF")).toBeInTheDocument();
    });

    it("displays privacy message in French", () => {
      render(<MainPage {...frenchProps} />);
      expect(screen.getByText("Confidentialité d'abord :")).toBeInTheDocument();
    });

    it("displays footer line in French", () => {
      render(<MainPage {...frenchProps} />);
      expect(screen.getByText((content) => content.includes("Développé par"))).toBeInTheDocument();
      expect(screen.getByText("Jema Technology")).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes("© 2026 • Open Source & Libre"))).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates to each feature page when clicking cards", () => {
      render(<MainPage {...defaultProps} />);

      const features = ["compress", "merge", "split", "extractPages", "grayscale", "resize"];
      const titles = ["Compress", "Merge", "Split", "Extract Pages", "Grayscale", "Resize"];

      titles.forEach((title, index) => {
        fireEvent.click(screen.getByText(title));
        expect(defaultProps.onSelectFeature).toHaveBeenCalledWith(features[index]);
      });
    });
  });
});
