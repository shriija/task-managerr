/**
 * Base API URL Configuration
 * Used by all Axios requests and Socket.io to connect to the backend server.
 * Uses Vite's environment variable loading (VITE_API_URL) for production,
 * and falls back to localhost for local development.
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";