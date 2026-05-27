import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
    }),
  },
}));

jest.mock("./lib/email", () => ({
  sendGenericEmail: jest.fn(() => Promise.resolve({ skipped: true })),
}));

test("renders the ECWA portal sign-in screen", async () => {
  render(<App />);

  expect(await screen.findByText("Welcome Back", {}, { timeout: 10000 })).toBeInTheDocument();
  expect(screen.getByText("Sign in to your Lafia Portal account")).toBeInTheDocument();
});
