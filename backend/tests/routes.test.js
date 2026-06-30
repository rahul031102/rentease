import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.js";
import productRoutes from "../routes/products.js";

// Lightweight smoke tests that don't require a live MongoDB connection.
// They verify routing, request validation, and error handling.
// Full integration tests (with a real/in-memory MongoDB) are a recommended next step.

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use((req, res) => res.status(404).json({ message: "Route not found" }));
  return app;
};

describe("Auth routes — input validation", () => {
  const app = buildApp();

  it("rejects registration without required fields", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "a@b.com" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });
});

describe("Unknown routes", () => {
  const app = buildApp();

  it("returns 404 for an undefined route", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
  });
});
